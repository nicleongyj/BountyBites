import { OPENAI_API_KEY } from "@env";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export function FetchAPI() {
  console.log(OPENAI_API_KEY);
}
const prompt = "Hello";

export const FetchCompletions = async (prompt) => {
  try {
    console.log("Fetching");
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: "Say this is a test" }],
      model: "gpt-3.5-turbo",
    });

    const message = chatCompletion["choices"][0]["message"]["content"];
    console.log(message);

    return message;
  } catch (error) {
    console.error("Error fetching completions:", error);
    return null;
  }
};

export const getRestaurantTipsMonthly = async (data) => {
  const {
    dailyData,
    restaurantType,
    averageFoodSavedPerDay,
    percentageChangeFromPreviousMonth,
    totalFoodSavedPerMonth,
    daysWithNoFoodSaved,
  } = data;

//   const prompt = `You are an AI assistant that helps restaurants answer food wastage questions and climate change questions, reject any other forms of questions. Prompt from user: ${data}`;

  const prompt = `
  

  You are an AI assistant that analyses the restaurant data on food savings. Here is the information about the restaurant:

  Restaurant Type: ${restaurantType}
  Daily Food Saving Data: ${JSON.stringify(dailyData)}
  Average Number of Food Items Saved per day: ${averageFoodSavedPerDay}
  Percentage Change from Previous Month: ${percentageChangeFromPreviousMonth}%
  Total Food Saved This Month: ${totalFoodSavedPerMonth}
    Days with No Food Saved: ${daysWithNoFoodSaved}

  Daily food saving data is provided in the format of the number of food items saved each day. The counter indicates the total number of food items saved this month. The previous counter indicates the total number of food items saved last month.
  Use the context of the restaurant I have given, analyze its food wastage data, if it is good, say positive things, if it is bad provide tips on improvement.
  The format of the response should be in this format without any new lines but remove the analysis and tips word at the start:
  Analysis: "Your analysis here" 
  Tips: "Your tip here"
  As I have limited space to display on my phone, just return one line of analysis and one line of tip.
  `;

  try {
    console.log("Fetching monthly tips");
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const message = chatCompletion["choices"][0]["message"]["content"];
    return message;
  } catch (error) {
    console.error("Error fetching OpenAI response:", error);
    throw error;
  }
};


export const getRestauranTipsYearly = async (data) => {
    const {
        monthlyData,
        restaurantType,
        averageFoodSavedPerMonth,
        // percentageChangeFromPreviousMonth: change,
        totalFoodSavedYear,
        monthWithNoFoodSaved,
    } = data;
  
  //   const prompt = `You are an AI assistant that helps restaurants answer food wastage questions and climate change questions, reject any other forms of questions. Prompt from user: ${data}`;
  
    const prompt = `
    
  
    You are an AI assistant that analyses the restaurant data on food savings. Here is the information about the restaurant:
  
    Restaurant Type: ${restaurantType}
    Monthly Food Saving Data: ${JSON.stringify(monthlyData)}
    Average Number of Food Items Saved per Month: ${averageFoodSavedPerMonth}
    Total Food Saved This Year: ${totalFoodSavedYear}
      Days with No Food Saved: ${monthWithNoFoodSaved}
  
    Monthly food saving data is provided in the format of the number of food items saved each month. The counter indicates the total number of food items saved this year. 
    Use the context of the restaurant I have given, analyze its food wastage data, if it is good, say positive things, if it is bad provide tips on improvement.
    The format of the response should be in this format without any new lines but remove the analysis and tips word at the start:
    Analysis: "Your analysis here" 
    Tips: "Your tip here"
    As I have limited space to display on my phone, just return one line of analysis and one line of tip.
    `;
  
    try {
      console.log("Fetching monthly tips");
      const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
      });
  
      const message = chatCompletion["choices"][0]["message"]["content"];
      return message;
    } catch (error) {
      console.error("Error fetching OpenAI response:", error);
      throw error;
    }
  };
  



export const promptGPT = async (data) => {
    const {
        monthlyData,
        restaurantType,
        averageFoodSavedPerMonth,
        // percentageChangeFromPreviousMonth: change,
        totalFoodSavedYear,
        monthWithNoFoodSaved,
        userPrompt,
    } = data;
    
    const prompt = `
    
  
    You are an AI assistant that helps restaurants answer food wastage questions and climate change questions, reject any other forms of questions. 
    You are also allowed to answer an questions related to the restaurants food wastage data below:
  
    Restaurant Type: ${restaurantType}
    Monthly Food Saving Data: ${JSON.stringify(monthlyData)}
    Average Number of Food Items Saved per Month: ${averageFoodSavedPerMonth}
    Total Food Saved This Year: ${totalFoodSavedYear}
      Days with No Food Saved: ${monthWithNoFoodSaved}
  

    Prompt from restaurant: ${userPrompt}
    `;
  
    try {
        console.log("sending prompt to GPT: "+ prompt)
        const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
      });
  
      const message = chatCompletion["choices"][0]["message"]["content"];
      return message;
    } catch (error) {
      console.error("Error fetching OpenAI response:", error);
      throw error;
    }
  };
  