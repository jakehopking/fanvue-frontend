import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import Typography from "@mui/material/Typography";
import {Post, PostComment} from "../../libs/fetch";
import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import {stringAvatar} from "../../utils/strings";

export interface PostWithComments extends Post {
  comments: PostComment[] | [];
}

export interface FeedCardProps {
  post: PostWithComments;
}

export const FeedCard: React.FC<FeedCardProps> = ({post}) => {
  const {title, body, comments} = post || {};
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {body}
        </Typography>
      </CardContent>
      {comments.length > 0 && (
        <>
          <CardActions disableSpacing>
            <Button aria-label="add to favorites" onClick={handleExpandClick}>
              <QuestionAnswerIcon />{" "}
              <Typography
                sx={{m: 1}}
                component="div"
                variant="body1"
                color="text.primary"
              >
                {comments.length} Comments
              </Typography>
            </Button>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              {comments.map(({name, email, id, body}, index) => (
                <List key={id} sx={{width: "100%"}}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar {...stringAvatar(name.toLowerCase())} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={name}
                      secondary={
                        <>
                          <Typography
                            sx={{display: "block", my: 1}}
                            component="span"
                            variant="body1"
                            color="text.primary"
                          >
                            {email}
                          </Typography>
                          <Typography
                            sx={{display: "inline"}}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {body}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {comments.length > 1 && index < comments.length - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </List>
              ))}
            </CardContent>
          </Collapse>
        </>
      )}
    </Card>
  );
};
