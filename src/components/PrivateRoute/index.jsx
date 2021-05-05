import React from 'react';
import { Route, Redirect } from 'react-router-dom';


// const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
//     const { logUser } = useContext(AuthContext)
//     return (
//         <Route {...rest}
//             render={routeProps => logUser
//                 ? (<RouteComponent {...routeProps} />)
//                 : (<Redirect to={`/user`} />)}
//         />
//     );
// }

// export default PrivateRoute;


const PrivateRoute = ({ children, isLoged, backTo, ...rest }) => {
    return (
        <Route
            {...rest}
            render={({ location }) =>
                isLoged ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: backTo ? backTo : "/",
                            state: { from: location },
                        }}
                    />
                )
            }
        />
    );
};

export default PrivateRoute;