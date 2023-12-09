import { OpenAI } from "openai";

const ASSISTANT_ID = "asst_nM3DhppBgoSuCL0NwUovuG09";
const OPENAI_API_KEY = "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";

const callOpenAI = async (prompt) => {
  var openai, assistant, thread;

  if (!openai || !assistant || !thread) {
    // Create a new OpenAI instance
    console.log("Initializing OpenAI");

    openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    console.log("OpenAI Initialized", openai);

    // Retrieve the assistant
    console.log("Initializing Assistant");

    assistant = await openai.beta.assistants.retrieve(ASSISTANT_ID);

    console.log("Assistant Initialized", assistant);

    // Create a new thread
    console.log("Initializing Thread");

    thread = await openai.beta.threads.create();

    console.log("Thread Initialized", thread);
  }

  // Create a new message
  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: prompt,
  });

  // Run the assistant
  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
  });

  // Retrieve the message status
  var message = await openai.beta.threads.runs.retrieve(thread.id, run.id);

  console.log("Status of run: ");
  console.log(message);

  while (message.status == "in_progress") {
    message = await openai.beta.threads.runs.retrieve(thread.id, run.id);
  }

  console.log("Status of run after wait: ");
  console.log(message);

  // Retrieve the message
  const response = await openai.beta.threads.messages.list(thread.id);

  console.log("Response: ");
  console.log(response);

  console.log(String(response.data[0].content[0].text.value));
  return String(response.data[0].content[0].text.value);
};

export default callOpenAI;
