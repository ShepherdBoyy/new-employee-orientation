import Master from "@/Layout/Master";
import TopicCard from "./component/TopicCard";
function Index({ topics }) {
    return (
        <>
            <div className="mx-auto w-full space-y-6 p-6 lg:p-8">
                <TopicCard topics={topics} />
            </div>
        </>
    );
}

Index.layout = (page: React.ReactNode) => <Master>{page}</Master>;

export default Index;
