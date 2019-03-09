import {createStackNavigator} from 'react-navigation';
import Login from '../../screens/login/Login';
import Signup from '../../screens/signUp/SignUp';
import HomeScreen from '../../screens/homeScreen/HomeScreen'
import BookDetail from '../../screens/bookDetail/BookDetail'
import BookCategory from '../../screens/booksByCategory/BooksByCategory'
import CategoryList from '../../screens/categoryList/CategoryList';
import Otp from '../../screens/otp/Otp';
import Review from '../../screens/review/Review';
import Bookmarks from '../../screens/bookmark/Bookmark';
const AppNavigator=createStackNavigator({
    Login:{
        screen:Login
    },
    Signup:{
        screen:Signup
    },
    Home:{
      screen:HomeScreen
    },
    BookDetail:{
      screen:BookDetail
    },
    BookCategory:{
      screen:BookCategory
    },
    CategoryList:{
      screen:CategoryList
    },
    Otp:{
      screen:Otp
    },
    Review:{
      screen:Review
    },
    Bookmarks:{
      screen:Bookmarks
    }

},
{
    initialRouteName:'Home',
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
   });

export default AppNavigator;