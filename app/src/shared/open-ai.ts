import { Configuration, CreateCompletionRequest, OpenAIApi } from 'openai';
import { sortBy } from 'lodash';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const getFromPrompt = async (
  prompt: string,
  model: CreateCompletionRequest['model'],
  config: Omit<CreateCompletionRequest, 'model' | 'prompt'> = { best_of: 1, max_tokens: 250 },
) => {
  try {
    console.log(`[openai]: Getting completion from ${model}`);

    const completion = await openai.createCompletion({
      model,
      prompt,
      ...config,
    });

    if (completion && completion.data && completion?.data?.choices && completion.data.choices.length > 0) {
      console.log(`[openai]: Got completion from ${model}`);
      return completion.data.choices[0].text;
    }
  } catch (error) {
    console.error(error);
  }

  return undefined;
};

export const openaiGetClusterName = async (keywords: string[]) => {
  const prompt = `Write a name this cluster of keywords, be specific

${sortBy(keywords, (kw) => -kw.split(' ').length)
  .slice(0, 20)
  .join('.\n')}

Name:`;

  let result = await getFromPrompt(prompt, 'text-davinci-002', {
    stop: ['\n'],
    max_tokens: 15,
    temperature: 0.9,
  });

  if (result?.trim() === '') {
    result = await getFromPrompt(prompt, 'text-davinci-002', {
      stop: ['\n'],
      max_tokens: 20,
      temperature: 0.7,
    });
  }

  const final = result?.trim();
  if (!final) {
    console.log(`[openai]: No cluster name found for ${JSON.stringify(prompt)}`);
    return undefined;
  }

  return final;
};

export const openaiGetClusterCategory = async (keywords: string[]) => {
  const prompt = `Write a name for this cluster of posts, be specific

${sortBy(keywords, (kw) => -kw.split(' ').length)
  .slice(0, 20)
  .join('.\n')}

Name:`;

  const result = await getFromPrompt(prompt, 'text-davinci-002', {
    stop: ['\n'],
    max_tokens: 15,
    temperature: 0.8,
    presence_penalty: 0.5,
  });

  const final = result?.trim();
  if (!final) {
    console.log(`[openai]: No cluster name found for ${JSON.stringify(prompt)}`);
    return undefined;
  }

  return final;
};
