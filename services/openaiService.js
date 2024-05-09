// openaiService.js
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

const getMaxTokens = (preferredParagraphs, length) => {
  // Set default value for preferredParagraphs if not specified
  if (!preferredParagraphs) preferredParagraphs = "No Preference";

  // Determine the number of paragraphs
  let numParagraphs;
  switch (preferredParagraphs) {
    case "1-2":
      numParagraphs = 2;
      break;
    case "2-3":
      numParagraphs = 3;
      break;
    case "3-4":
      numParagraphs = 4;
      break;
    case "4-5":
      numParagraphs = 5;
      break;
    case "<5":
      numParagraphs = 5;
      break;
    default:
      numParagraphs = 1;
      break;
  }

  // Determine the number of words per paragraph
  let numWords;
  switch (length) {
    case "Medium":
      numWords = [100, 200, 300];
      break;
    case "Long":
      numWords = [200, 300, 400, 500];
      break;
    case "Extra Long":
      numWords = [300, 400, 500, 600, 700, 800, 900, 1000];
      break;
    default:
      numWords = [50, 75, 100];
      break;
  }

  // Shuffle the array of word counts to add some randomness
  numWords.sort(() => Math.random() - 0.5);

  // Calculate the total number of tokens based on the number of paragraphs and the variable number of words per paragraph
  const totalTokens =
    numWords.reduce((total, curr) => total + curr, 0) * numParagraphs;

  return totalTokens;
};
export const generateReferencesAndCitations = async (emailContent, claim) => {

  try {
    const maxTokens = emailContent.size + 200;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are ChatGPT, a large language model trained by OpenAI. Your task is to help users create and modify email content based on their requirements.",
        },
        {
          role: "user",
          content: `I want you to create an email copy with subject and body. The email content is as follows:\n\n${emailContent}`,
        },
        {
          role: "assistant",
          content:
            "Email content generated. Let me know if you need any modifications or additional information.",
        },
        {
          role: "user",
          content: `Please provide updated email with references and citations for the mail content provided by you earlier. Please note always provide references at the last paragraph of the response in the email `,
        },
      ],
      max_tokens: maxTokens,
      n: 1,
      stop: null,
      temperature: 0.5,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const referencesAndCitations =
      completion.data.choices[0].message.content.trim();

    return referencesAndCitations;
  } catch (error) {
    console.error("Error generating references and citations:", error);
    return "";
  }
};

export const generateEmail = async ({
  typeOfEmail,
  recipient,
  messages,
  details,
  background,
  goal,
  tone,
  length,
  brandName,
  therapyArea,
  preferredParagraphs,
}) => {
  try {
    const maxTokens = getMaxTokens(preferredParagraphs, length);

    let messageContent = "";
    messages.forEach((message, index) => {
      if (message) {
        messageContent += `\nWhat do I want to tell them:${
          index + 1
        }: ${message} `;
      }
    });

    let optionalFields = "";
    if (brandName) {
      optionalFields += `\nBrand Name: ${brandName}`;
    }
    if (therapyArea) {
      optionalFields += `\nTherapy Area: ${therapyArea}`;
    }
    if (preferredParagraphs) {
      optionalFields += `\nNo. of preferred paragraphs: ${preferredParagraphs}`;
    }
    if (typeOfEmail) {
      optionalFields += `\nType of Email: ${typeOfEmail}`;
    }
    if (recipient) {
      optionalFields += `\nRecipient: ${recipient}`;
    }
    if (details) {
      optionalFields += `\nDetails: ${details}`;
    }
    if (background) {
      optionalFields += `\nBackground: ${background}`;
    }
    if (goal) {
      optionalFields += `\nWhat do I want to accomplish?: ${goal}`;
    }
    if (tone && tone != "Select") {
      optionalFields += `\nTone: ${tone}`;
    }
    if (length) {
      optionalFields += `\nLength of the email (in words): ${length}`;
    }

    // const content = `I want you to create an email copy with a subject and body. Your task is to help users create emails based on my requirements. As these are scientific content, you will need to provide specifics. If you are making any claims in the email copy, you will need to provide numbers such as percentage, exact numbers as much as possible. You must provide the citations and references of your claims. As these are scientific medical content, you shall avoid as much as possible using words that sound too "salesy" such as the best, leading, guarantee, cheap etc. As the target audience are largely healthcare professionals, you need to make them feel like our content helps them achieve better patient outcomes. Finally, you must make the content sound classy and elegant as if the best copywriter in the world has written it.:${optionalFields}${messageContent}`;
    const content = `I want you to create an email copy with a subject and body. Your task is to help users create emails based on my requirements. It is important to provide specific details and statistics to support any claims made. Additionally, all claims should be backed by reliable and credible sources and properly cite, you will need to provide numbers such as percentage, exact numbers as much as possible. You must provide the citations and references of your claims. As these are scientific medical content, you shall avoid as much as possible using words that sound too "salesy" such as the best, leading, guarantee, cheap etc. As the target audience are largely healthcare professionals, you need to make them feel like our content helps them achieve better patient outcomes. Finally, you must make the content sound classy and elegant as if the best copywriter in the world has written it.:${optionalFields}${messageContent}`;


    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are ChatGPT, a large language model trained by OpenAI. Your task is to help users create and modify email content based on their requirements",
        },
        {
          role: "user",
          content: content,
        },
      ],
      max_tokens: maxTokens,
      n: 1,
      stop: null,
      temperature: 0.5,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const email = completion.data.choices[0].message.content.trim();
    // console.log(email);
    return email;
  } catch (error) {
    console.error("Error generating email:", error);
    return "";
  }
};

export const generateContent = async (
  field,
  action,
  currentContent,
  comments
) => {
  try {
    let numTokens;

    if (action === "add") {
      numTokens = Math.max((currentContent.split(" ").length + 50) * 2, 50);
    } else if (action === "remove") {
      numTokens = Math.max((currentContent.split(" ").length - 50) * 2, 50);
    } else {
      // refresh
      numTokens = Math.max(currentContent.split(" ").length * 2, 50);
    }

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are ChatGPT, a large language model trained by OpenAI. Your task is to help users create emails based on their requirements.",
        },
        {
          role: "user",
          content: `Your task is to modify previously created content based on user feedback. As the content is scientific in nature, it is important to provide specific details and statistics to support any claims made. Additionally, all claims should be backed by reliable and credible sources and properly cited.To maintain the scientific integrity of the content, it is important to avoid using salesy language, such as "the best," "proven," "leading," "guarantee," and "cheap." As the target audience is largely composed of healthcare professionals, it is important to make them feel that the content helps them achieve better patient outcomes. The content must also comply with typical medical, legal, and regulatory standards.Finally, it is important to make the content sound classy and elegant, as if it were written by the best copywriter in the world. Please ${action} the content for the "${field}" field. The current content is as follows:\n\n${currentContent}\n\nIf you are adding content, provide a relevant sentence or two that fits well with the existing content. If you are removing content, identify a sentence or phrase that can be removed without affecting the overall message. If you are refreshing the content, provide an alternative version that conveys the same meaning.${
            comments ? "\n\nAdditional comments: " + comments : ""
          }`,
        },
      ],
      max_tokens: numTokens,
      n: 1,
      stop: null,
      temperature: 0.5,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    let generatedContent = completion.data.choices[0].message.content.trim();

    // Remove heading content ending with :
    generatedContent = generatedContent.replace(/^[^:\n]*:\s*/gm, "");

    // Remove paragraph starting with "This version"
    generatedContent = generatedContent.replace(/^This version\s.*$/gm, "");

    generatedContent = generatedContent.replace(
      /^These alternatives\s.*$/gm,
      ""
    );

    // Remove paragraph starting with "This version"
    generatedContent = generatedContent.replace(
      /^This alternative version\s.*$/gm,
      ""
    );

    if (field === "subject") {
      generatedContent = generatedContent.replace(/^This \s.*$/gm, "");
      generatedContent = generatedContent.replace(/^OR \s.*$/gm, "");
    }

    return generatedContent.trim();
  } catch (error) {
    console.error("Error generating content:", error);
    return "";
  }
};

export const generateLayoutsAndImage = async (emailContent) => {
  try {
    // Generate an image using DALL-E 2
    const imageResponse = await openai.createImage({
      size: "1024x1024",
      prompt: `Generate an image based on this email content: ${emailContent}`,
      n: 1,
    });

    const imageUrl = imageResponse.data.data[0].url;

    // Generate 10 HTML layouts
    const layoutResponse = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are ChatGPT, a large language model trained by OpenAI. Your task is to help users create 10 different HTML layout templates with the given email content and an image generated by DALL-E 2.",
        },
        {
          role: "user",
          content: `Create 10 HTML layout templates with the following email content and image URL:\n\nEmail content: ${emailContent}\n\nImage URL: ${imageUrl}`,
        },
      ],
      max_tokens: 1000,
      n: 1,
      stop: null,
      temperature: 0.5,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const layouts = layoutResponse.data.choices[0].message.content
      .trim()
      .split("\n");

    return { imageUrl, layouts };
  } catch (error) {
    console.error("Error generating layouts and image:", error);
    return { imageUrl: "", layouts: [] };
  }
};

export const generateBannerImage = async (additionalInstruction, colors) => {
  try {
    const color1 = colors[0];
    const color2 = colors[1];
    // Generate an image using DALL-E 2
    const imageResponse = await openai.createImage({
      size: "1024x1024",
      prompt: `Generate a banner image with the following additional instruction and color tone: ${additionalInstruction}\n\nColor 1: ${color1}\n\nColor 2: ${color2}`,
      n: 1,
    });
    const imageUrl = imageResponse.data.data[0].url;

    return imageUrl;
  } catch (error) {
    console.error("Error generating banner image:", error);
    return "";
  }
};

export const generateEmailDesigns = async (htmlEmailContent) => {
  try {
    // Generate 5 different email designs based on the HTML email content
    const layoutResponse = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are ChatGPT, a large language model trained by OpenAI. Your task is to help users create different email designs based on their given HTML email content.",
        },
        {
          role: "user",
          content: `Create different email designs based on the following HTML email content:\n\n${htmlEmailContent}`,
        },
      ],
      max_tokens: 1000,
      n: 1,
      stop: null,
      temperature: 0.5,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const designs = layoutResponse.data.choices[0].message.content
      .trim()
      .split("\n\n");

    console.log(designs);

    return { designs };
  } catch (error) {
    console.error("Error generating email designs:", error);
    return { designs: [] };
  }
};
