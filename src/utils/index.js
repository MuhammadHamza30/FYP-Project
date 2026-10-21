import { auth } from "../APIS/config";
export const askGemini = async (question) => {
  const endpoint = process.env.REACT_APP_AI_ENDPOINT;
  if (!endpoint)
    throw new Error(
      "AI assistant is not configured. Set REACT_APP_AI_ENDPOINT to your authenticated server endpoint.",
    );
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Sign in to use the assistant.");
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ question }),
    signal: AbortSignal.timeout(45000),
  });
  if (!response.ok)
    throw new Error("The assistant is unavailable. Please try again later.");
  const data = await response.json();
  if (typeof data.answer !== "string")
    throw new Error("The assistant returned an invalid response.");
  return data.answer;
};
