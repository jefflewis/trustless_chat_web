import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";

function Room() {
  const { id } = useParams();
  const [] = useSearchParams();

  return (
    <div className="App">
      <header className="App-header">
        <p>Join ROOM NAME</p>
      </header>
    </div>
  );
}
