export const tracks = [
    {
      "name": "Discoteca",
      "link": "https://open.spotify.com/track/5z5v5S83TnXCDRFVuz9A37?si=c027e79a1e5f4d7f"
    },
    {
      "name": "Fly High",
      "link": "https://open.spotify.com/track/1rPR4fhHszuxEsXJlWgEAM?si=a2577f32e3414ab1"
    },
    {
      "name": "GPT Beat",
      "link": "https://open.spotify.com/track/2YRVX4lWQYSdDEbuUgJCXb?si=fcf4ce1e7ec34121"
    },
    {
      "name": "Moises Again ...",
      "link": "https://open.spotify.com/track/3Q7y3wKLbGgu0V4BcSET1b?si=ef08402e48c94474"
    },
    {
      "name": "Angles - 128 BPM",
      "link": "https://open.spotify.com/track/4fydAE1pCOpWSlF6cHCafM?si=80c99c5af3dd4d8c"
    },
    {
      "name": "el techno",
      "link": "https://open.spotify.com/track/7K8AV1gm5UgUr5kL8LKneJ?si=d7d9cd9639c041df"
    },
    {
      "name": "Tsunami",
      "link": "https://open.spotify.com/track/5unxnWzikVXeuYdjPkEk98?si=7096e21525014a3a"
    },
    {
      "name": "Triggered",
      "link": "https://open.spotify.com/track/3MrdQROwqElVgSaESuuIGW?si=d85c138577de4666"
    },
    {
      "name": "Floating - 125 BPM",
      "link": "https://open.spotify.com/track/4m05p0A2nQA5XX3OTbe5LX?si=efc45b73af544e33"
    }
  ];

  const sendTrackOfDay = async () => { 

    const trackIndex = getDayOfYear() % tracks.length;
    const track = tracks[trackIndex];
    console.log(track);
  
    const message = `I also make music ;)\n\n${track.link}`;
  
    const res = await twitterClient.v2.tweet(message);
    console.log(res);
  }