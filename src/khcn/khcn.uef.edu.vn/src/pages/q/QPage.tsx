import { PageLoader, QuestionLayout } from "@/components";
import { UserLogin } from "@/models/UserLogin";
import { Frontmatter } from "@/types";
import { SERVER_API_URL } from "@/utils/env";
import { TypographyStylesProvider } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const QPage: React.FC = () => {
  const user: UserLogin = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string
  );

  // get idCauHoi from route
  const { idCauHoi } = useParams();
  console.log(idCauHoi);

  const [meta, setMeta] = useState<Frontmatter>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${SERVER_API_URL}/CauHoi/Get-by-id-publish/${idCauHoi}`,
        {
          headers: {
            Authorization: `Bearer ${user.Token}`,
          },
        }
      );
      console.log(res.data);
      setMeta(res.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  if (!meta) {
    return <PageLoader />;
  }
  return (
    <QuestionLayout question={meta}>
      <TypographyStylesProvider>
        <div dangerouslySetInnerHTML={{ __html: meta.traLoi }} />
      </TypographyStylesProvider>
    </QuestionLayout>
  );
};

export default QPage;
