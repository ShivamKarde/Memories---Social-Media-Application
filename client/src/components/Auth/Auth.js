import React, {useState} from 'react'
import { Avatar, Button, Paper, Grid, Typography, Container, TextField } from '@material-ui/core';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Icon from './icon';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import useStyles from './styles';
import Input from './Input';
import { signin, signup } from '../../actions/auth';

const initialState= {firstName: '', lastName: '', email: '', password: '', confirmPassword: ''}

const Auth = () => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const dispatch= useDispatch();
    const history = useHistory();

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);
    const handleSubmit = (e) => {
      e.preventDefault();
      if(isSignup) {
        dispatch(signup(formData, history))
      } else {
        dispatch(signin(formData, history))
      }
    };
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const switchMode = () => {
      setIsSignup((prevIsSignup) => !prevIsSignup );
      setShowPassword(false);
    };

    const googleSuccess = async ( res ) => {
      const token = res?.credential;
      const result = jwt_decode(token);
      try {
        dispatch({ type: 'AUTH', data: { result, token } });
        history.push('/');
      } catch (error) {
        console.log(error)
      }
    };

    const googleFailure = ( error ) => {
      console.log(error);
      console.log("Google Sign In was unsuccessful. Try Again Later");
    };
  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
        <form className={classes.from} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {
              isSignup && (
                <>
                  <Input name="firstName" label="First Name" handleChange = {handleChange} autoFocus half/>
                  <Input name="lastName" label="Last Name" handleChange = {handleChange} half />
                </>
              )}
              <Input name="email" label="Email Address" handleChange={handleChange} type="email"/>
              <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
              { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" /> }
            </Grid>
            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
              {isSignup ? 'Sign Up' : 'Sign In'}
            </Button>
            <div className={classes.customgbutton}>
              <GoogleLogin 
                  //clientId="348589739204-dhrdv15vmi9q93r90n7k13hk882i7nnv.apps.googleusercontent.com"
                  // render={(renderProps) => (
                  //   <Button 
                  //     className={classes.googleButton} 
                  //     color='primary' 
                  //     fullWidth 
                  //     onClick={renderProps.onClick} 
                  //     disabled={renderProps.disabled} 
                  //     startIcon={<Icon />} 
                  //     variant="contained"
                  //   >
                  //     Google Sign In
                  //   </Button>
                  // )}
                  onSuccess={googleSuccess}
                  onFailure={googleFailure}
                  //cookiePolicy="single_host_origin"
                />
            </div>
              
            <Grid container justifyContent="flex-end">
                <Grid item>
                    <Button onClick={switchMode}>
                      { isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                    </Button>
                </Grid>
            </Grid>
        </form>
      </Paper>
    </Container>
  )
}

export default Auth;

//eyJhbGciOiJSUzI1NiIsImtpZCI6IjdkMzM0NDk3NTA2YWNiNzRjZGVlZGFhNjYxODRkMTU1NDdmODM2OTMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzNDg1ODk3MzkyMDQtZGhyZHYxNXZtaTlxOTNyOTBuN2sxM2hrODgyaTdubnYuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIzNDg1ODk3MzkyMDQtZGhyZHYxNXZtaTlxOTNyOTBuN2sxM2hrODgyaTdubnYuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDMwMDM3MDU0OTAzMzM4MTM1MDYiLCJlbWFpbCI6ImthcmRlc2hpdmFtMDJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTY5NzU1MTU0MSwibmFtZSI6IlNoaXZhbSBLYXJkZSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJVGEzLXRPSy1SRG50YTZKbVE5aDdhZ0dpcHNRdFphZ3FpQ0RXemVJOGg9czk2LWMiLCJnaXZlbl9uYW1lIjoiU2hpdmFtIiwiZmFtaWx5X25hbWUiOiJLYXJkZSIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNjk3NTUxODQxLCJleHAiOjE2OTc1NTU0NDEsImp0aSI6IjU3ZjY3NTk2ZmNmOGMzYTA2OGI0M2ViNGE3ZjcxZGVhZjQ0MWU4MTQifQ.QtIE-Uz-C9SqPFb25JSrjIOZPtLBYZfht0e88SWhYOjO-MSP6dh4qp9jZQZQfxnEMW3sGjj9EDGwhJ8fG86Wvw36iqtMWH9Gfl9JjqDrUwzRcfJXnj40xgelq1JMu2XjwudfNFgrmTKSROo-qMCdYKqFPpbJS3MT0C_b4pc-RdL8r-W_eC1qMHM_Wkr8xn7D2b-Zapf9WquPjt4YWcyg4it0QmjG32SHY48mUhTyqDF884TYJfEpaqY-YwBVMe1VXiw0JuAE6-8gD6u8Xtg9BeAmCnTGEf7NLTfV9viS8ZJYSbYP9VTsEpnn3EK9IG8rRflRomaOg9KuqVqVhTOOdA
//eyJhbGciOiJSUzI1NiIsImtpZCI6IjdkMzM0NDk3NTA2YWNiNzRjZGVlZGFhNjYxODRkMTU1NDdmODM2OTMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzNDg1ODk3MzkyMDQtZGhyZHYxNXZtaTlxOTNyOTBuN2sxM2hrODgyaTdubnYuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIzNDg1ODk3MzkyMDQtZGhyZHYxNXZtaTlxOTNyOTBuN2sxM2hrODgyaTdubnYuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDMwMDM3MDU0OTAzMzM4MTM1MDYiLCJlbWFpbCI6ImthcmRlc2hpdmFtMDJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTY5NzU1NTMyMiwibmFtZSI6IlNoaXZhbSBLYXJkZSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJVGEzLXRPSy1SRG50YTZKbVE5aDdhZ0dpcHNRdFphZ3FpQ0RXemVJOGg9czk2LWMiLCJnaXZlbl9uYW1lIjoiU2hpdmFtIiwiZmFtaWx5X25hbWUiOiJLYXJkZSIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNjk3NTU1NjIyLCJleHAiOjE2OTc1NTkyMjIsImp0aSI6IjIwM2Q4MjY5ODE5ZGIwNmU1OTc1Zjk0ZDhkNzFmZjJhYzFiMjY4ZWUifQ.Qj_OOmTJXRSp4Kw6XDJeY9vSr45RuEfL8aih3Mzd1XZJLRUwvZQ4HLBTO1tezvwD_DYSMU_KSFg7kOGRg7BBnKiYBxv1EexHf4LNZiq2W6v4qtISX1q3mKOxMQ9jv03UQdWcWqA1OTrOBaE-rMLME8mMifCWvm2zWmU5Lt0hnaesfaxljAGn3Lta3n8Xj6OsOBgfYN8kNR-09qLeg6SmwRzW0f1Cu3ITN-ur3LlwBGdvJWg50GCnwNgdGuMN4r-MUfWZ0KLMvqSaZ_aZz2HWSyvz-1OFx5hDli455iAliKgiSM8vz7Xs9_-rend1imjaWr7a3DhytBXPiJlXuq3vLQ

