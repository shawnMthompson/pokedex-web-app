import "./App.css"; // Importing CSS file
import EducationTable from "./components/EducationTable"; // Importing EducationTable component
import ProjectCard from "./components/ProjectCard"; // Importing ProjectCard component
import WorkTable from "./components/WorkTable"; // Importing WorkTable component

function App() {
  return (
    <>
      <div className="text-blue-500 p-10" id="test">
        <h1>Hello, World!</h1>
      </div>
      < EducationTable />
      < ProjectCard />
      < WorkTable />
    </>
  );
}

export default App;
