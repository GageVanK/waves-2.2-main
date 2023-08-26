import { getFollowersForUser } from "deso-protocol";
import { useEffect, useState } from "react";
import { Player } from "@livepeer/react";
import {
  Text,
  Avatar,
  Group,
  Badge,
 createStyles,
  Paper,
  TypographyStylesProvider,
  Center,
  Space,
  ActionIcon,
  Tooltip,
  Image,
  Loader,
} from "@mantine/core";
import { useNavigate } from "react-router";

const useStyles = createStyles((theme) => ({
  comment: {
    padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`,
  },

  
}));
//Waves Tab Feed Component thats displays all current livestreams
export const WavesFeed = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [wavesFeed, setWavesFeed] = useState([]);

  const [streams, setStreams] = useState([]);

  useEffect(() => {
    async function fetchStreams() {
      try {
        const response = await fetch('https://livepeer.studio/api/stream?streamsonly=1&filters=[{"id": "isActive", "value": true}]');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setStreams(data);
        console.log(data)
      } catch (error) {
        console.error('Error fetching streams:', error);
      }
    }

    fetchStreams();
  }, []);



  


//Map through the filteredPosts to display the current livestreams 
   // Render the filtered posts or the "No Waves" message
  return (
    <div>
      {streams.length > 0 ? (
        streams.map((post) => (
          <>
            <Paper
              m="md"
              shadow="lg"
              radius="md"
              p="xl"
              withBorder
              key={post.PublicKeyBase58Check}
              className={classes.comment}
            >
              <Center>
                <ActionIcon>
                
               
                  <Text weight="bold" size="sm">
                    {streams.name}
                  </Text>
                </ActionIcon>
              </Center>
              <Space h="xl" />
              <Player
                  title={streams.name}
                  playbackId={streams.playbackId}
                  autoPlay
                  muted
                />
            </Paper>
          </>
        ))
      ) : (
        <Center>
              
        <Badge
                  size="md"
                  radius="sm"
                  variant="gradient"
                  gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                >
            No Waves Right Now.
         
        </Badge>
        <Space h={222} />
            </Center>
      )}
    </div>
  );
};
