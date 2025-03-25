import Container from "../components/layout/Container";
import Sidebar from "../components/layout/Sidebar";
import Post from "../components/ui/Post";
import ToggleTheme from "../components/ui/ToggleTheme";

const Home = () => {
  return (
    <Container className="">
      <div className="flex justify-between py-28">
        <Post
          title="Breaking News: New Technology Revolutionizing the Industry"
          publishDate="March 18, 2025"
          author="Jane Doe"
          description="A new technology has emerged that is expected to revolutionize the industry. Experts are excited about the potential impact this could have on businesses and consumers alike."
        />
        <Sidebar />
      </div>
      <ToggleTheme />
    </Container>
  );
};

export default Home;
