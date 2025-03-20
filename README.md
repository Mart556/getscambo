# GetScambo

GetScambo is a web-based game where players determine if an image is a scam or not. The game fetches images from a database and validates user answers. The project consists of a backend API built with Express and a frontend built with React and Vite.

### Gameplay 

Scambo is an engaging web-based game that challenges players to identify scam images by determining their authenticity. Here's how to play:

1. Objective: Your goal is to assess a series of images and decide whether each one is a scam or not.

2. Viewing Images: Each round, an image is displayed for you to evaluate.

3. Making a Decision: For each image, choose whether you believe it is a scam or not.

4. Feedback:

Correct Guess: If your assessment is accurate, you receive a point and you go to the next round.
Incorrect Guess: If your assessment is incorrect you lose the game.

5. Scoring: Accurate assessments earn points a point. Strive to accumulate the highest score possible.

6. Limited Attempts: You have a finite number of images to evaluate. The game concludes when all images have been assessed in time limit or when you guess the answear wrong.

7. Winning the Game: Achieve a high score by correctly identifying as many scam images as possible within the given time.

8. Challenge Yourself: The game tests your ability to discern authentic images from scams, enhancing your awareness and critical thinking skills.

Dive into Scambo to sharpen your scam detection abilities and enjoy the challenge of identifying deceptive images!


## Prerequisites

-   Node.js (version 18 or higher)
-   pnpm (version 7 or higher)
-   MySQL

## Setup

1. **Clone the repository:**

```sh
git clone https://github.com/yourusername/getscambo.git
cd getscambo
```

2. **Install dependencies:**

cd backend
pnpm install

cd ../frontend
pnpm install

3. **Set up the database**

Create a MySQL database and import the db.sql file to set up the schema and initial data.

4. **Set up the env file**

Create a .env file in the backend directory

DB_HOST=127.0.0.1
DB_USER=yourusername
DB_PASSWORD=yourpassword
DB_NAME=getscambo

5. **Start the backend server:**

cd backend
pnpm dev

6. **Start the frontend server:**

cd frontend
pnpm dev



7. **Development Process**

Identify the user group who we will make the game for.
Design the first idea on figma for the game 
https://www.figma.com/design/XVxEL8iIzYynoRJqmLOkQ2/h%C3%A4katon?node-id=0-1&t=gYkCMoohA8kEUFWd-1 
For modeling the Database we used Draw.io
Framework Vite, React, Tailwind

8. **Main target group**

Young people who have not recived scam mails or texts yet so they dont know what those look like.
People who have already got scammed over an email or text and are still not sure what the scam mails look like. 

9. **Design process**

Because the main focus is on younger people we chose the scolor scheme from different online game platforms like:
https://richup.io/
https://www.crazygames.com/
Page is made simple to navigate 
Has a leaderboard to make it more competative


10. **Used sources for images**

For different examples of scam/real messages and e-mails we used:
Friends and our own recived e-mails
https://eestielu.goodnews.ee/lisatud-naited-i-millised-on-petukirjade-tunnused-politsei-selgitab/
https://rmp.geenius.ee/uudised/maksundus-uudised/maksu-ja-tolliameti-nimel-saadetava-petukirja-ja-sonumi-aratundmine/
https://majandus.postimees.ee/8132576/pildid-petised-levitavad-lhv-nime-all-uusi-petukirju
https://rmp.geenius.ee/uudised/juhile/maksu-ja-tolliameti-nimel-on-liikvel-uus-petukiri/

11. **Used sources for ideas**

https://annabellavs23.ikt.khk.ee/veebiarendus/h%c3%a4katon/index.html
https://www.banksneveraskthat.com/
https://www.banksneveraskthat.com/protect-yourself/
https://www.cdse.edu/Training/Security-Awareness-Games/
https://securityawareness.usalearning.gov/cdse/multimedia/games/citrivia/index.html#
https://natwest.mymoneysense.com/parents/articles/avoiding-fraud-and-online-scams/

12. **AI usage**

For the logo we use ChatGPT to make the prompt fo the logo 
Input to ChatGPT was:

a logo for online game where you have to pick if the image is a scam or not. should be in green red purple and white colors with a scam in the middle and is readable

Output  from ChatGPT was:

"Create a logo for an online game where players decide if an image is a scam or not. The logo should feature bold, readable text with the word 'SCAM' in the center. Use green, red, purple, and white as the main colors. Incorporate a visual element that contrasts the legitimacy of images, like a shield or checkmark symbol to represent the decision-making aspect of the game. Make the design modern, engaging, and clear, with a strong visual emphasis on the word 'SCAM' while ensuring it's easily readable." 

To create the logo we used https://fooocus.one/playground
