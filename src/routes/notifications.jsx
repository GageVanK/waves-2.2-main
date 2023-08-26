import {
  Avatar,
  Paper,
  Group,
  Text,
  Space,
  Center,
  Divider,
  List,
  Loader,
  Badge,
  UnstyledButton,
  createStyles,
} from "@mantine/core";
import { useState, useContext, useEffect } from "react";
import { DeSoIdentityContext } from "react-deso-protocol";
import { getNotifications, getSingleProfile } from "deso-protocol";
import { useNavigate } from "react-router";
import {
  IconHeart,
  IconUsers,
  IconMessage2,
  IconDiamond,
  IconRecycle,
  IconAt,
  IconCoin
} from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  main: {
    width: "100%",
    maxWidth: "666px",
    margin: "0 auto",
    overflowX: "auto", // or "hidden" if you want to hide any overflowing content
    whiteSpace: "nowrap",
  },
}));

export const NotificationsPage = () => {
  const { classes } = useStyles();
  const { currentUser, isLoading } = useContext(DeSoIdentityContext);
  const [notifications, setNotifications] = useState([]);
  const userPublicKey = currentUser?.PublicKeyBase58Check;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationData = await getNotifications({
          PublicKeyBase58Check: userPublicKey,
          NumToFetch: 25,
          FetchStartIndex: -1,
        });
console.log(notificationData)
        // Iterate through the notifications and fetch the usernames
        const updatedNotifications = await Promise.all(
          notificationData.Notifications.map(async (notification) => {
            const request = {
              PublicKeyBase58Check:
                notification.Metadata.TransactorPublicKeyBase58Check,
            };
            const profileResponse = await getSingleProfile(request);
            return {
              ...notification,
              username: profileResponse.Profile.Username,
            };
          })
        );

        setNotifications(updatedNotifications);
        console.log(updatedNotifications);
      } catch (error) {
        console.error("Error fetching user notifications:", error);
      }
    };

    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser, userPublicKey]);

  return (
    <div>
      <Divider
        my="xs"
        label={
          <>
            <Text fw={444} fz="xl">
              Notifications
            </Text>
          </>
        }
        labelPosition="center"
      />

      {currentUser ? (
        <>
          {isLoading ? (
            <Loader variant="bars" />
          ) : (
            /* Render the notifications once loaded */

            notifications.map((notification, index) => (
              <>
             <Paper shadow="sm" p="xl" withBorder>
                <Group className={classes.main} >
                  <UnstyledButton
                    onClick={() => {
                      navigate(`/wave/${notification.username}`);
                    }}
                    variant="transparent"
                  >
                    <Group style={{ width: "100%", flexGrow: 1 }}>
                      <Avatar
                        size="md"
                        src={
                          `https://node.deso.org/api/v0/get-single-profile-picture/${notification.Metadata.TransactorPublicKeyBase58Check}` ||
                          null
                        }
                      />
                      <div>
                        <Text truncate weight="bold" size="sm">
                          {notification.username}
                        </Text>
                      </div>
                    </Group>
                  </UnstyledButton>

                  {notification.Metadata.TxnType === "LIKE" && (
                    <>
                   
                      <div>
                        <IconHeart />
                      </div>
                      <Text weight="bold" size="sm">
                        Liked your
                      </Text>
                      
                   
                    <Group position="right">
                    <UnstyledButton
                      onClick={() => {
                        navigate(
                          `/post/${notification.Metadata.LikeTxindexMetadata.PostHashHex}`
                        );
                      }}
                      variant="transparent"
                    >
                      <Text weight="bold" size="sm">
                        Post
                      </Text>
                    </UnstyledButton>
                  </Group>
                    </>
                  )}
                  {notification.Metadata.TxnType === "FOLLOW" && (
                    <Group position='right'>
                      <div>
                        <IconUsers />
                      </div>
                      <Text weight="bold" size="sm">
                        Followed you
                      </Text>
                    </Group>
                  )}
                  {notification.Metadata.TxnType === "SUBMIT_POST" &&
                    notification.Metadata.AffectedPublicKeys[0].Metadata ===
                      "RepostedPublicKeyBase58Check" && (
                      <>
                      <Group>
                        <div>
                          <IconRecycle />
                        </div>
                        <Text weight="bold" size="sm">
                          Reposted your
                        </Text>
                          
                      </Group>
                       <Group position="right">
                       <UnstyledButton
                      onClick={() => {
                        navigate(
                          `/post/${notification.Metadata.SubmitPostTxindexMetadata.PostHashBeingModifiedHex}`
                        );
                      }}
                      variant="transparent"
                    >
                       <Text weight="bold" size="sm">
                         Post
                       </Text>
                       </UnstyledButton>
                     </Group>
                     </>
                    )}
{notification.Metadata.TxnType === "SUBMIT_POST" && notification.Metadata.AffectedPublicKeys.length >= 2 && notification.Metadata.AffectedPublicKeys[0].Metadata === "BasicTransferOutput" &&
  notification.Metadata.AffectedPublicKeys[1].Metadata === "MentionedPublicKeyBase58Check" && (
    <>
      <Group>
        <div>
          <IconAt />
        </div>
        <Text weight="bold" size="sm">
          Mentioned You in
        </Text>
      </Group>
      <Group position="right">
        <UnstyledButton
          onClick={() => {
            navigate(
              `/post/${notification.Metadata.SubmitPostTxindexMetadata.PostHashBeingModifiedHex}`
            );
          }}
          variant="transparent"
        >
          <Text weight="bold" size="sm">
            Post
          </Text>
        </UnstyledButton>
      </Group>
    </>
  )}

{notification.Metadata.TxnType === "SUBMIT_POST" && notification.Metadata.AffectedPublicKeys.length >= 2 &&
  notification.Metadata.AffectedPublicKeys[1].Metadata === "ParentPosterPublicKeyBase58Check" && (
    <>
      <Group>
        <div>
          <IconAt />
        </div>
        <Text weight="bold" size="sm">
          Commented on
        </Text>
      </Group>
      <Group position="right">
        <UnstyledButton
          onClick={() => {
            navigate(
              `/post/${notification.Metadata.SubmitPostTxindexMetadata.ParentPostHashHex}`
            );
          }}
          variant="transparent"
        >
          <Text weight="bold" size="sm">
            Post
          </Text>
        </UnstyledButton>
      </Group>
    </>
  )}
                  {notification.Metadata.TxnType === "SUBMIT_POST" &&
                    notification.Metadata.AffectedPublicKeys[0].Metadata ===
                      "MentionedPublicKeyBase58Check" && (
                    <>
                    <Group>
                        <div>
                          <IconAt />
                        </div>
                        <Text weight="bold" size="sm">
                          Mentioned You in
                        </Text>
                          
                      </Group>
                       <Group position="right">
                       <UnstyledButton
                      onClick={() => {
                        navigate(
                          `/post/${notification.Metadata.SubmitPostTxindexMetadata.PostHashBeingModifiedHex}`
                        );
                      }}
                      variant="transparent"
                    >
                       <Text weight="bold" size="sm">
                         Post
                       </Text>
                       </UnstyledButton>
                     </Group>
                     </>
                    )}
                  {notification.Metadata.TxnType === "SUBMIT_POST" &&
                    notification.Metadata.AffectedPublicKeys[0].Metadata ===
                      "ParentPosterPublicKeyBase58Check" && (
                      <>
                      <Group>
                        <div>
                          <IconMessage2 />
                        </div>
                        <Text weight="bold" size="sm">
                          Commented on
                        </Text>
                       
                      </Group>
                       <Group position="right">
                       <UnstyledButton
                      onClick={() => {
                        navigate(
                          `/post/${notification.Metadata.SubmitPostTxindexMetadata.ParentPostHashHex}`
                        );
                      }}
                      variant="transparent"
                    >
                       <Text weight="bold" size="sm">
                         Post
                       </Text>
                       </UnstyledButton>
                     </Group>
                     </>
                    )}

                  {notification.Metadata.BasicTransferTxindexMetadata &&
                    notification.Metadata.BasicTransferTxindexMetadata
                      .DiamondLevel && (
                    <>
                    <Group position="right">
                        <div>
                          <IconDiamond />
                        </div>
                        <Text weight="bold" size="sm">
                          Tipped a Diamond
                        </Text>
                      
                      </Group>
                        
                      </>
                    )}
                    {notification.Metadata.TxnType === 
"CREATOR_COIN" &&
                    notification.Metadata.CreatorCoinTxindexMetadata
                      .OperationType === "buy" && (
                    <>
                    <Group position="right">
                        <div>
                          <IconCoin />
                        </div>
                        <Text weight="bold" size="sm">
                          Bought your Creator Coin
                        </Text>
                      
                      </Group>
                        
                      </>
                    )}
                    {notification.Metadata.TxnType === 
"CREATOR_COIN" &&
                    notification.Metadata.CreatorCoinTxindexMetadata
                      .OperationType === "sold" && (
                    <>
                    <Group position="right">
                        <div>
                          <IconCoin />
                        </div>
                        <Text weight="bold" size="sm">
                          Bought your Creator Coin
                        </Text>
                      
                      </Group>
                        
                      </>
                    )}
                    {notification.Metadata.TxnType === 
 "BASIC_TRANSFER" &&
 notification.Metadata.AffectedPublicKeys[0].Metadata ===
 "BasicTransferOutput" && notification.Metadata.AffectedPublicKeys[0].PublicKeyBase58Check
 === currentUser.PublicKeyBase58Check && (
                    <>
                    <Group position="right">
                        <div>
                          <IconCoin />
                        </div>
                        <Text weight="bold" size="sm">
                          Sent You DeSo
                        </Text>
                      
                      </Group>
                        
                      </>
                    )}
                   
                </Group>
                </Paper>
              </>
            ))
          )}
        </>
      ) : (
        <>
          <Space h="xl" />
          <Center>
            <Badge
              size="md"
              radius="sm"
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan", deg: 45 }}
            >
              Please login to view your Notifications.
            </Badge>
          </Center>
        </>
      )}
      <Space h={111} />
    </div>
  );
};
