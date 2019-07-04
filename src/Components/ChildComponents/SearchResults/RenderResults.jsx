import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import { Grid, Paper, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({ 
    card:{
        maxWidth: 250,
        minWidth: 250,
    },
    cardImage:{
        maxWidth: 250,
        minWidth: 200,
    },
}))


export default function RenderResults(props){
    const searchResults = props.searchResults
    const classes = useStyles();

    return(
        <React.Fragment>
            <Typography variant="h5" component="h2">Search results</Typography>
            <div style={{ marginTop: 20, padding: 4 }}>
                <Grid container spacing={1} justify="center">
                    {/**post.map generates one card for each element in const posts*/}
                    {searchResults.map(result => (
                        <Grid item key={result.title}>
                            <Card classes={{root: classes.card}}>
                                <CardActionArea>
                                <CardMedia
                                    component="img"
                                    alt={result.title}
                                    height="210"
                                    src={result.coverimg}
                                    title="Contemplative Reptile"
                                    classes= {{media: classes.cardImage}}
                                />
                                <CardContent>
                                    <Typography variant="h6" component="h2" noWrap={true}>
                                        {result.title}
                                    </Typography>
                                    <Typography variant="body1" component="div" noWrap={true}>
                                        {result.author}
                                    </Typography>
                                    {/**<Typography component="p" variant="body1" noWrap={true}>{result.synopsis}</Typography>*/}
                                </CardContent>
                                </CardActionArea>
                                <CardActions>
                                <Button id={result.id} size="small" color="primary">
                                    Borrow
                                </Button>
                                <Button size="small" color="primary">
                                    Details
                                </Button>
                                {/** 
                                Have to mimic this:
                                On click event:
                                onClick={()=>{that.borrowRequest(searchResults[i].id);}}

                                InnerHTML of button:
                                  borrowButton.onclick = function(event){};
                                if (cartCheck === -1){
                                    borrowButton.innerHTML = "Borrow";
                                    resultSpan.appendChild(borrowButton);
                                } else {
                                    borrowButton.innerHTML = "Cancel";
                                    resultSpan.appendChild(borrowButton);
                                }
                                */}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </React.Fragment>
    )
}