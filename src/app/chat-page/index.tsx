import Head from "@src/components/head";
import PageLayout from "@src/components/page-layout";
import { Chat } from "@src/containers/chat";
import LocaleSelect from "@src/containers/locale-select";
import TopHead from "@src/containers/top-head";
import useTranslate from "@src/hooks/use-translate";

export const ChatPage = () => {
  const { t } = useTranslate();
  return (
    <PageLayout>
      <TopHead />
      <Head title={t("chat.title")}>
        <LocaleSelect />
      </Head>
      <Chat />
    </PageLayout>
  );
};
