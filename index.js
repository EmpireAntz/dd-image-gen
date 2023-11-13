import OpenAI from "openai" //Imports the Open AI module
import readline from "readline" //Imports the readline module which will read the inputs from the command line
import fs from "fs" //Imports the file system module
import dotenv from "dotenv" //Imports enviroment variable module
dotenv.config() 

//Initialize the Open AI instance with our api key which is hidden in an environment variable
const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY
});

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin, //Sets the standard input as the input source
  output: process.stdout //Sets the standard output as the output source
});

//Define a function to ask a question and return a promise that resolves with the answer
function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve)) 
}

//Main function will ask four questions to compile a prompt
async function main() {
  const question1 = await askQuestion("What is your characters name?: ") //Asks you to enter a character name
  const question2 = await askQuestion("What is your characters class?: ") //Asks you to enter a character class
  const question3 = await askQuestion("what is your characters race?: ") //Asky you to enter a characters race
  const question4 = await askQuestion("Give a short backstory and description of your character: ") //Ask you for a background and description of your character

  //Concatenate responses to form the prompt
  const prompt = `generate a dungeons and dragons character based on the following inputs: ${question1}, ${question2}, ${question3}, ${question4}`

  //Generate the image
  const image = await openai.images.generate({ 
    model: "dall-e-3", //The OpenAi model we are using to construct images
    prompt: prompt //The prompt above will be given to dall-e with the answered questions filled in. Note: Dall-e will re-engineer the prompt 
  })

  console.log(image.data); //Logs our image data so we can see the url and the revised prompt
  const imageUrl = image.data[0].url //generated image url
  const imageDescription = image.data[0].revised_prompt //prompt given to dall-e will be revised by gpt to help better the image outcome

  //Generated html to be written to the index.html file
  const htmlContent = 
  `<!DOCTYPE html>
   <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <img src="${imageUrl}" alt="${imageDescription}">
            <p>Name: ${question1}</p>
            <p>Class: ${question2}</p>
            <p>Race: ${question3}</p>
            <p>Background: ${question4}</p>
        </body>
    </html>`
    
  fs.writeFileSync('index.html', htmlContent) //Writes the above html content to index.html

  rl.close() //Closes the readline interface
}
 
main() //Calls the main function 