import MainPage from "./pages/MainPage";
import "./app.scss";

const App: React.FC = () => {
    return (
        <>
            <MainPage />
            <div className="copyright">
                <a target="_blank" rel="noreferrer" href="https://vk.com/kazakovstepan">&copy; 2020-2022, kazakovstepan</a>
            </div>
        </>
    );
};

export default App;