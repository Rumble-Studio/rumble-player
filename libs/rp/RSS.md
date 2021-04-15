# File Formating for Podcasts RSS Feeds

### What is RSS Feed ?

RSS is a Web content syndication format.
Its name is an acronym for **R**eally **S**imple **S**yndication.

RSS is a dialect of XML. All RSS files must conform to the XML 1.0 specification,
as published on the World Wide Web Consortium (W3C) website.
RSS is an open method for delivering regularly changing web content. 
Many news-related sites, weblogs, and other online publishers syndicate their content as an RSS Feed to whoever wants it.
In our case at Rumble Studio  we will use it for publishing podcasts

###### In brief:

- RSS is a protocol that provides an open method of syndicating and aggregating web content.

- RSS is a standard for publishing regular updates to web-based content.

- RSS is a Syndication Standard based on a type of XML file that resides on an Internet server.

- RSS is an XML application, which conforms to the W3C's RDF specification and is extensible via XML.

### RSS Feed for Podcasts

As mentioned above, RSS is xml compliant , in other word it is an xml file. 
Although the link to an RSS feed can have the .rss format, 
it always returns a xml file that can be formatted and styled.
to style it, we have to use the xml-stylesheet tag as shown in the code below :

```xml
<?xml-stylesheet href="modern.css"
  title="Modern" media="screen"
  type="text/css"?>
  ```

Some fields are required for the RSS file at channel/podcast level tag : 

- `<item>` Defines an episode. You must have at least one <item> element in the feed.
- `<link>` Fully-qualified URL of the homepage of your podcast. Make sure that the page does not require a password
- `<title>` Name of the podcast.
- ``` xml
  <image>
      <link>Podcast homepage</link>
      <title>should match the title tag of homepage</title>
      <url>Link to image</url>
    </image>```

Required fields for episode level tags are :

- `<enclosure>` Fully-qualified URL of the episode audio file. 
  Audio files with the following extensions are supported: aac, m4a, mp3, ogg, wav.
- `<title>` Title of the podcast episode.

Find below an example of a RSS Feed for podcast: 

````xml
<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title>The Name of your podcast</title>
    <link>Link to your website</link>
    <description>Describe your podcast here.</description>
    <language>The language of your podcast (en-us)</language>
    <pubDate>Most recent date that an item was published to your RSS feed (Tue, 10 Jun 2003 04:00:00 GMT)</pubDate>
    <lastBuildDate>The last time the content of the channel changed.</lastBuildDate>
    <docs>A url that points to the documentation of the RSS format used in the feed. 
      (help file very 2002) : http://blogs.law.harvard.edu/tech/rss</docs>
    <generator>the tool/place used to make your feed (ex. Rumble Studio).</generator>
    <managingEditor>Email address for individual responsible for editorial content</managingEditor>
    <webMaster>Email address for person responsible for technical issues relating to channel.</webMaster>

    <item>
      <title>Episode Title</title>
      <link>The link to the episode post.</link>
      <enclosure> The URL, byte size, and type of your media file</enclosure>
      <description>Episode description</description>
      <pubDate>Publication date of the episode.</pubDate>
      <guid>globally unique identifier” is how podcast apps know whether they’ve downloaded this episode before.
        This must NEVER change, especially if you move podcast hosts or switch domains or change to HTTPS.
        Only time to change this is if you must force a redownload</guid>
    </item>
    
  </channel>
</rss>
````

More : 
For publishing podcasts to Google podcast and/or iTunes :

[Link](https://support.google.com/podcast-publishers/answer/9889544?hl=en)

To check and visualize RSS Feed File for Podcasts visit : 

[Link](https://castfeedvalidator.com)
