import axios from "axios";
import { TwitterApi } from "twitter-api-v2";

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY ?? "",
  appSecret: process.env.TWITTER_API_SECRET ?? "", // Ensure this environment variable is set
  accessToken: process.env.TWITTER_ACCESS_TOKEN ?? "", // Ensure this environment variable is set,
  accessSecret: process.env.TWITTER_TOKEN_SECRET ?? "",
});

export async function GET(req: Request) {
  try {
    console.log("Starting Twitter API client initialization.");

    const projectData = await axios.get(
      "https://raw.githubusercontent.com/mtrejo0/moisestrejo.com/master/src/information/p5jsProjects.json",
    );
    const projects = projectData.data;

    // Select a random project from the list
    const randomProject = projects[Math.floor(Math.random() * projects.length)];

    // Add the current date to the project data
    randomProject.date = new Date().toISOString();

    // Add link to moisestrejo.com
    randomProject.link = `https://moisestrejo.com/${randomProject.id}`;
    const message = `
${randomProject.name}
${randomProject.description.join(" ")}

${randomProject.link}
${randomProject.date}
Im trying to automate a way to pub the stuff I make. This bot will pub my p5 art. Later ill pub my music and workouts and what not.
        `;

    const res = await twitterClient.v2.tweet(message);

    return new Response(JSON.stringify({ message: "Yay", res }), {
      status: 200,
    });
  } catch (error) {
    console.error("Failed to retrieve user data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to retrieve user data" }),
      { status: 500 },
    );
  }
}
