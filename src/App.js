import React, { useEffect, useState } from 'react';
import './App.css';

const API_KEY = process.env.REACT_APP_API_KEY;
const API_KEY_UNSPLASH = process.env.REACT_APP_API_KEY_UNSPLASH;

const App = () => {
  const [data, setData] = useState([]);
  const [weather, setWeather] = useState("");
  const [imgData, setImgData] = useState([]);
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("chester");
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    handleFetch();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [search]);

  const handleFetch = async () => {
    try {
      const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${API_KEY}&units=metric`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch weather data");
      }
      const data = await response.json();
      setData(data);
      setWeather(data.weather[0].description);

      const imgResponse = await fetch(`https://api.unsplash.com/search/photos?query=${data.weather[0].description}&client_id=${API_KEY_UNSPLASH}`);
      if (imgResponse.status !== 200) {
        throw new Error("Failed to fetch images");
      }
      const imgData = await imgResponse.json();
      setImgData(imgData);
      setImg(imgData.results[Math.floor(Math.random() * 10)].urls.regular);
      console.log(imgData);
    } catch (Error) {
      setError(Error.message);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setSearch(input);
    setInput("");
  }

  if (loading) return <h1>Loading...</h1>;
  if (error) {
    return (
      <>
        <h1>Error.</h1>
        <h2>{error}</h2>
      </>
    );
  }

  const backgroundImgStyle = {
    backgroundImage: `url(${img})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat"
  }

  return (
    <div className="container">
      <h1 className="header">Check The Weather</h1>
        <div className="main" style={backgroundImgStyle}>
          <form onSubmit={handleSubmit}>
            <input type="text"
              name="search"
              className="searchBar"
              placeholder="Enter city name"
              value={input}
              onChange={(e) => setInput(e.target.value)} />
            <button className="submitButton" type="sumbit">Submit</button>
          </form>
          <h3 className="placeHeader">{data.name}</h3>
          <p className="text">Temperature: {data.main.temp}</p>
          <p className="text">Humidity: {data.main.humidity}</p>
          <p className="text">Weather: {weather}</p>
          <p className="text">Wind Speed: {data.wind.speed}mph</p>
        </div>
      <a href="https://github.com/BrandonCoates1" className="creator">By Brandon Coates</a>
    </div>
  );
}

// class App extends React.Component {
//   state ={
//     data: [],
//     error: false,
//     loading: true,
//   }

//   componentDidMount() {
//     this.handleFetch();
//     // can do it this way to create a loading screen at launch of app
//     setTimeout(() => {
//       this.setState({ loading: false });
//     }, 1000);
//   }

//   handleFetch = async () => {
//     try {
//       const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=manchester&appid=${API_KEY}&units=metric`);
//       const data = await response.json();
//       // or can do this with a property in the state
//       // this.setState({ data: data, loading: false });
//       this.setState({ data: data });
//     } catch (error) {
//       this.setState({ error: true });
//     }
//   }

//   render() {
//     const { data, loading } = this.state;
//     if (loading) return <h1>Loading...</h1>
//     if(this.state.error) return <h1>Error...</h1>
//     return (
//       <>
//         <h1>Hello World</h1>
//         {data.main && (
//           <div>
//               <h3>Name: {data.name}</h3>
//               <p>Temp: {data.main.temp}</p>
//           </div>
//         )}
//       </>
//     )
//   }
// }

export default App;