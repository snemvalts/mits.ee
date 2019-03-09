import urllib.request
import lxml.html
import os
import pymongo
import re
import datetime

# LANG = "et_EE"
LANG = "de_DE"

URL = "https://mobile.facebook.com"
EVENTS_URL = URL + "/MITS.ATI?v=events"
PAST_EVENTS_URL = EVENTS_URL + "&is_past=1"
LANG_URL = URL + "/a/language.php?l=" + LANG

DB_NAME = "mits"
COLLECTION = "events"

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client[DB_NAME][COLLECTION]

cookieProcessor = urllib.request.HTTPCookieProcessor()
opener = urllib.request.build_opener(cookieProcessor)


# Remove the first line of a string
def no_first_line(html: str) -> str:
    return "\n".join(html.split("\n")[1:])


def fetch(url: str) -> str:

    # https://mobile.facebook.com/a/language.php?l=et_EE

    # For Estonian language
    # request = urllib.request.Request(url, data=None, headers={"Accept-Language": "et_EE,et,q=0.5"})
    request = urllib.request.Request(url, data=None, headers={"Accept-Language": LANG})

    # return urllib.request.urlopen(request).read().decode("UTF-8")
    return opener.open(request).read().decode("UTF-8")


def parse_fb_date(date: str) -> datetime.datetime:

    # Esmaspäev, 11. veebruar 2019 18:00 – 21:00 UTC+02
    # regex1 = r".+, (\d+). (.+) (\d+) (?:kell )?(\d+):(\d+).* (?:UTC\+)(\d+)"

    # 30. Nov 2018 at 19:00 – 1. dets 2018 at 07:00 UTC+02
    # regex2 = r"(\d+). (.+) (\d+) at (\d+):(\d+) – .*UTC\+(\d+)"

    # Montag, 11. Februar 2019 von 18:00 bis 21:00 UTC+02
    # Donnerstag, 13. November 2014 um 20:00 UTC+02
    regex1 = r".+, (\d+). (.+) (\d+) (?:von|um) (\d+):(\d+) .*UTC\+(\d+)"

    # 30.11.2018 um 19:00 – 01.12.2018 um 07:00 UTC+02
    #regex2 = r"(\d\d).(\d\d).(\d\d\d\d) um (\d\d):(\d\d).+UTC\+(\d\d)"

    # 15. März um 18:00 – 16. März um 08:00 UTC+02
    regex2 = r"(\d+)\. (.+) um (\d+):(\d+) –.*UTC\+(\d+)"

    # German months
    months = [
        "januar", "februar", "märz", "april", "mai", "juni",
        "juli", "august", "september", "oktober", "november", "dezember"
    ]

    # Estonian months
    """
    months = [
        "jaanuar", "veebruar", "märts", "aprill", "mai", "juuni",
        "juuli", "august", "september", "oktoober", "november", "detsember"
    ]
    # http://www.eki.ee/itstandard/2000/FDCC.shtml.en
    short_months = [
        "jaan", "veebr", "märts", "apr", "mai", "juuni",
        "juuli", "aug", "sept", "okt", "nov", "dets"
    ]
    """

    if re.match(regex1, date):
        groups = re.match(regex1, date).groups()
        month = months.index(groups[1].lower()) + 1

    elif re.match(regex2, date):
        groups = re.match(regex2, date).groups()
        month = int(groups[1])
        #month = short_months.index(groups[1].lower()) + 1
        month = months.index(groups[1].lower()) + 1

    else:
        print("Invalid date:", date)
        return None

    year = int(groups[2])
    day = int(groups[0])
    hour = int(groups[3])
    minute = int(groups[4])

    ahead_of_utc = int(groups[5])
    tzinfo = datetime.timezone(datetime.timedelta(hours=ahead_of_utc))

    date = datetime.datetime(year, month, day, hour, minute, tzinfo=tzinfo)

    return date


# event_url = "/events/1562024990680108?....."
def parse_event(event_url: str) -> dict:

    # Strip everything after and including the question mark
    event_url = event_url.split("?")[0]

    event_id = event_url.split("/")[2]

    event = {
        "event_id": event_id,
        "title": "",
        "description": "",
        "fb_date": "",
        "date": None,
        "location": "",
        "image_url": ""
    }

    event_html = fetch(URL + event_url)

    # Uncomment to save event files
    """
    with open(os.path.join("events", event_id), "w") as f:
        f.write(event_html)
    """

    event_tree = lxml.html.fromstring(no_first_line(event_html))

    # The event title is in the <title> element
    try:
        title = event_tree.xpath("//title")[0].text
        event["title"] = title

    except Exception as e:
        print("Failed to parse title:", e)

    # The event description is in <meta name="description"> in the content attribute
    try:
        description = event_tree.xpath("//meta[@name='description']")[0].attrib["content"]
        event["description"] = description

    except Exception as e:
        print("Failed to parse description:", e)

    # The date of course doesn't always have the same class
    # Luckily, the summary is in <div id="event_summary">
    try:
        summary = event_tree.xpath("//div[@id='event_summary']/div/div")

        if len(summary) >= 1:
            date = summary[0].attrib["title"]
            event["fb_date"] = date
            event["date"] = parse_fb_date(date)

        if len(summary) >= 2:
            location = summary[1].attrib["title"]
            event["location"] = location

    except Exception as e:
        print("Failed to parse date and location:", e)

    # The second image is the event image
    # Probably not the best way, but this gets both img and video thumbnails
    try:
        image_url = event_tree.xpath("//img")[1].attrib["src"]
        event["image_url"] = image_url

        # Uncomment to save images
        """
        image = urllib.request.urlopen(image_url).read()
        with open(os.path.join("img", event_id + ".jpg"), "wb") as f:
            f.write(image)
        """

    except Exception as e:
        print("Failed to parse image:", e)

    return event


# Save event to database or update if already exists
def save(event: dict) -> None:
    """
    with open("events.txt", "a") as f:
        f.write(str(event) + "\n")
    """

    if db.find_one({"event_id": event["event_id"]}):
        db.update_one(
            {"event_id": event["event_id"]},
            {"$set": event}
        )
    else:
        db.insert_one(event)


def fetch_upcoming() -> None:

    events_html = fetch(EVENTS_URL)

    # Uncomment to save this html
    """
    with open("upcoming_events.html", "w", encoding="UTF-8") as f:
        f.write(events_html)
    """

    events_tree = lxml.html.fromstring(no_first_line(events_html))

    # <div id="root"> is the closest with an id
    events = events_tree.xpath("//div[@id='root']/div/div/div/div/table/tbody/tr/td/div/div")

    for div in events:
        # The only <a> inside a <span><div> is link to the event
        event_url = div.xpath("span/div/a")[0].attrib["href"]

        event = parse_event(event_url)
        save(event)

        print(event_url)
        print(event)
        print("\n---\n")


def fetch_past() -> None:

    past_events_url = PAST_EVENTS_URL

    while True:
        events_html = fetch(past_events_url)

        # Uncomment to save this html
        """
        with open("past_events.html", "w", encoding="UTF-8") as f:
            f.write(events_html)
        """

        events_tree = lxml.html.fromstring(no_first_line(events_html))

        # <div id="root"> is the closest with an id
        events = events_tree.xpath("//div[@id='root']/div/div/div/div/table/tbody/tr/td/div/div")

        for div in events:
            # The only <a> inside a <span><div> is link to the event
            event_url = div.xpath("span/div/a")[0].attrib["href"]

            event = parse_event(event_url)
            save(event)

            print(event_url)
            print(event)
            print("\n---\n")

        # The "See more events" button has this id for some reason
        more = events_tree.xpath("//div[@id='m_more_friends_who_like_this']/a")

        if more:
            past_events_url = URL + more[0].attrib["href"]
        else:
            break


if __name__ == "__main__":

    fetch(LANG_URL)

    fetch_upcoming()
    # fetch_past()

    # print(fetch(EVENTS_URL))
