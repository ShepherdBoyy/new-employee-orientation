import Master from "@/Layout/Master";
import TopicCard from "./component/TopicCard";
function Index({ topics }) {
    return (
        <>
            <TopicCard topics={topics} />
        </>
    );
}

Index.layout = (page: React.ReactNode) => <Master>{page}</Master>;

export default Index;
