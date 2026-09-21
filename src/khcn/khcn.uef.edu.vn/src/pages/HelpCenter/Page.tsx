import { QuestionsList } from "@/components";
import { UserLogin } from "@/models/UserLogin";
import { SERVER_API_URL } from "@/utils/env";
import axios from "axios";
import { useEffect, useState } from "react";

const HelpCenterPage = () => {
  const user: UserLogin = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string
  );

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    getAllQuestionsAnswered();
  }, []);

  const getAllQuestionsAnswered = async () => {
    try {
      const res = await axios.get(
        `${SERVER_API_URL}/CauHoi/Get-all-quest-ans`,
        {
          headers: {
            Authorization: `Bearer ${user.Token}`,
          },
        }
      );
      if (res.status === 200) {
        setQuestions(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <QuestionsList data={questions} />
    </div>
  );
};

export default HelpCenterPage;
