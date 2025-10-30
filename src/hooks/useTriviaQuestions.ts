import { useState, useEffect } from "react";
import { ApiQuestion, ApiQuestionsResponse, Question } from "../app/types";
import { decodeHtmlEntities } from "../utils/decode";
import { urls } from "../constants/urlConfig";

export function useTriviaQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`${urls.trivia}/api.php?amount=50`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 429) {
            throw new Error(
              "Too many requests. Please wait 5 seconds before refreshing :)",
            );
          }
          throw new Error("Failed to fetch data");
        }
        return res.json() as Promise<ApiQuestionsResponse>;
      })
      .then((raw) => {
        if (raw.response_code !== 0) {
          let errorMessage: string;
          switch (raw.response_code) {
            case 1:
              errorMessage =
                "No Results: Could not return results. The API doesn't have enough questions for your query. (Ex. Asking for 50 Questions in a Category that only has 20.)";
              break;
            case 2:
              errorMessage =
                "Invalid Parameter: Contains an invalid parameter. Arguements passed in aren't valid. (Ex. Amount = Five)";
              break;
            case 3:
              errorMessage = "Token Not Found: Session Token does not exist.";
              break;
            case 4:
              errorMessage =
                "Token Empty: Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.";
              break;
            case 5:
              errorMessage =
                "Rate Limit: Too many requests have occurred. Each IP can only access the API once every 5 seconds.";
              break;
            default:
              errorMessage = `Unknown API error (code: ${raw.response_code})`;
          }
          throw new Error(errorMessage);
        }
        const results: Question[] = raw.results.map((q: ApiQuestion) => ({
          type: q.type,
          difficulty: q.difficulty,
          category: decodeHtmlEntities(q.category),
          question: decodeHtmlEntities(q.question),
          correctAnswer: decodeHtmlEntities(q.correct_answer),
          incorrectAnswers: q.incorrect_answers.map(decodeHtmlEntities),
        }));
        setQuestions(results);
      })
      .catch((err) => {
        if (err) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { questions, error, isLoading };
}
