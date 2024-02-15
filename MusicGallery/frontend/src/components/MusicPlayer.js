import React, { useState } from "react";
import {
  Grid,
  Typography,
  Card,
  IconButton,
  LinearProgress,
} from "@material-ui/core";
import axios from "axios";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import Alert from "@mui/material/Alert";
const MusicPlayer = (props) => {
  const songProgress = (props.time / props.duration) * 100;
  const [alertOpen, setAlertOpen] = useState(false);
  const [actionPerformed, setActionPerformed] = useState(null);
  const [errorData, setErrorData] = useState(null);

  const control = props.ctrl;
  const host = props.is_host;
  const pauseSong = () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/pause", requestOptions);
  };

  const playSong = () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/play", requestOptions);
  };

  const skipSong = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/skip", requestOptions);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
    setActionPerformed(null);
    // setErrorData(null);
  };

  return (
    <Card>
      <Grid container alignItems="center">
        <Grid item align="center" xs={4}>
          <img
            src={props.image_url}
            height="100%"
            width="100%"
            alt="Album Cover"
          />
        </Grid>
        <Grid item align="center" xs={8}>
          <Typography component="h5" variant="h5">
            {props.title}
          </Typography>
          <Typography color="textSecondary" variant="subtitle1">
            {props.artist}
          </Typography>
          <div>
            <IconButton
              onClick={() => {
                props.is_playing ? pauseSong() : playSong();
              }}
            >
              {props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton onClick={skipSong}>
              <SkipNextIcon />
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <LinearProgress variant="determinate" value={songProgress} />
      {/* <div>{control}</div> */}
      {/* {alertOpen && (
        <Alert
          autohideduration={3000}
          onClose={handleAlertClose}
          severity="warning"
        >
          {host
            ? `To ${
                actionPerformed === "pause" ? "pause" : "play"
              } the song, You (Host) must have the premium account.`
            : control
            ? `To ${
                actionPerformed === "pause" ? "pause" : "play"
              } the song, Host must have the premium account.`
            : "Only host has control of playback state"}
        </Alert>
      )} */}
    </Card>
  );
};

export default MusicPlayer;
