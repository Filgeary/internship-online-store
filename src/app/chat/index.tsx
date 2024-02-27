import { memo } from "react";
import Head from "../../components/head";
import PageLayout from "../../components/page-layout";
import Spinner from "../../components/spinner";
import LocaleSelect from "../../containers/locale-select";
import Navigation from "../../containers/navigation";
import TopHead from "../../containers/top-head";
import useSelector from "../../hooks/use-selector";
import useTranslate from "../../hooks/use-translate";
import ChatRoom from "../../containers/chat-room";


function Chat() {
  const select = useSelector(state => ({
    profile: state.profile.data,
    waiting: state.profile.waiting,
  }));

  const {t} = useTranslate();

  return (
    <PageLayout>
      <TopHead/>
      <Head title={t("menu.chat")}>
        <LocaleSelect/>
      </Head>
      <Navigation/>
      <Spinner active={select.waiting}>
        <ChatRoom />
      </Spinner>
    </PageLayout>
  );
}

export default memo(Chat);
