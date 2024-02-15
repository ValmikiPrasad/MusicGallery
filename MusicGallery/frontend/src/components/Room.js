import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Typography,
} from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";
import { useNavigate, useParams } from "react-router-dom";

const Room = (props) => {
  const [roomDetails, setRoomDetails] = useState({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
    showSettings: false,
    spotifyAuthenticated: false,
    song:{}
  });

  const { roomCode } = useParams();
  const navigate=useNavigate();


  useEffect(() => {
    // Call getRoomDetails once initially
    getRoomDetails();
  
    // Set up an interval to call getCurrentSong every second
    const getCurrentSongInterval = setInterval(getCurrentSong, 1000);
  
    // Clear the interval on component unmount
    return () => {
      clearInterval(getCurrentSongInterval);
    };
  }, []);

  const getRoomDetails = () => {
    fetch("/api/get-room/" + roomCode)
      .then((response) => {
        if (!response.ok) {
          props.leaveRoomCallback();
          navigate("/");
        }
        return response.json();
      })
      .then((data) => {
        setRoomDetails({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
          showSettings: roomDetails.showSettings,
          spotifyAuthenticated: roomDetails.spotifyAuthenticated,
        });

        if (data.is_host) {
          authenticateSpotify();
        }
      });
      getCurrentSong()
  };
  const getCurrentSong = () => {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setRoomDetails((prevDetails) => ({
          ...prevDetails,
          song: data,
        }));
        console.log(data)
      });
  };

  const authenticateSpotify = () => {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        setRoomDetails((prevDetails) => ({
          ...prevDetails,
          spotifyAuthenticated: data.status,
        }));
        console.log(data.status)
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  };

  const leaveButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    fetch("/api/leave-room", requestOptions).then((_response) => {
      props.leaveRoomCallback();
      navigate("/");
    });
  };

  const updateShowSettings = (value) => {
    setRoomDetails((prevDetails) => ({
      ...prevDetails,
      showSettings: value,
    }));
  };

  const renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={roomDetails.votesToSkip}
            guestCanPause={roomDetails.guestCanPause}
            roomCode={roomCode}
            updateCallback={getRoomDetails}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => updateShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderSettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => updateShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  };

  if (roomDetails.showSettings) {
    return renderSettings();
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      {/* Add other components using roomDetails */}
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          votes: {roomDetails.votesToSkip}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          guest_can_pause: {roomDetails.guestCanPause.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          host: {roomDetails.isHost.toString()}
        </Typography>
      </Grid>
      {/* <MusicPlayer
        title={roomDetails.song.title}
        artist={roomDetails.song.artist}
        image_url={roomDetails.song.image_url}
        is_playing={roomDetails.song.is_playing}
        time={roomDetails.song.time}
        duration={roomDetails.song.duration}
      /> */}

      <MusicPlayer {...roomDetails.song} ctrl={roomDetails.guestCanPause} is_host={roomDetails.isHost}/>
      {roomDetails.isHost ? renderSettingsButton() : null}
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={leaveButtonPressed}
        >
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
};

export default Room;
