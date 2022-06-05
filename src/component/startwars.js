import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  TextField,
  Divider,
} from "@mui/material";
import "./startwars.css";

const StartWars = () => {
  const [characters, setCharacters] = useState();
  const [isloading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [recentMovie, setRecentMovie] = useState({});
  useEffect(() => {
    let xhrLogin = new XMLHttpRequest();
    // let that = this;
    xhrLogin.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        let responseText = JSON.parse(this.responseText);
        setCharacters(responseText.results);
        console.log(responseText);
      }
    });
    xhrLogin.open("GET", "https://swapi.dev/api/people/");
    xhrLogin.send();
  }, []);
  useEffect(() => {
    const movie = (movies || []).reduce(
      (a, b) => (a.release_date > b.release_date ? a : b),
      {}
    );
    setRecentMovie(movie);
  }, [movies]);

  const handleCharacterChange = (event) => {
    // event.persist();
    console.log(event.target.value);
    const films = characters.find((p) => p.name === event.target.value).films;
    getFilms(films);
    console.log(films);
  };

  const queryFilms = (films) => {
    return films.map((url) =>
      fetch(url, {
        method: "GET",
      })
    );
  };

  const getFilms = async (filmsUrl) => {
    setLoading(true);
    setMovies([]);
    const response = await Promise.all(queryFilms(filmsUrl));
    response.forEach(async (r) => {
      if (r.status === 200) {
        const f = await r.json();
        setMovies((prevArray) => [...prevArray, f]);
        console.log(movies);
      }
    });
    setLoading(false);
  };

  return (
    <div>
      {isloading && (
        <div className="spinnerContainer">
          <CircularProgress />
        </div>
      )}
      <Card sx={{ maxWidth: 345 }}>
        <CardContent>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Character
            </Typography>
            {characters && (
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                onChange={handleCharacterChange}
              >
                {characters.map((person) => (
                  <MenuItem key={person.name} value={person.name}>
                    {person.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </FormControl>
          <Divider light />
          <Typography variant="subtitle2" gutterBottom component="div">
            List of Movies
          </Typography>
          <List>
            {!isloading &&
              (movies || []).map((movie) => (
                <ListItem key={movie.title}>
                  <ListItemText primary={movie.title} />
                </ListItem>
              ))}
          </List>
        </CardContent>
        <Divider light />
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Name/Year last Movie:
          </Typography>
          {recentMovie.title && (
            <TextField
              fullWidth
              id="standard-read-only-input"
              value={recentMovie.title + " " + recentMovie.release_date}
              InputProps={{
                readOnly: true,
              }}
              variant="standard"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default StartWars;
