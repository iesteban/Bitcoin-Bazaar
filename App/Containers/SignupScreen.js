// @flow

import React from 'react'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  LayoutAnimation
} from 'react-native'
import { connect } from 'react-redux'
import {
  Container,
  Content
} from 'native-base'
import Styles from './Styles/SignupScreenStyle'
import {Images, Metrics} from '../Themes'
import LoginActions from '../Redux/LoginRedux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import I18n from 'react-native-i18n'
import CommonHeader from '../Components/CommonHeader'
import NamedLogo from '../Components/NamedLogo'

type SignupScreenProps = {
  dispatch: () => any,
  fetching: boolean,
  // error: object,
  attemptSignup: () => void
}

class SignupScreen extends React.Component {

  props: SignupScreenProps

  state: {
    email: string,
    password1: string,
    password2: string,
    visibleHeight: number,
    topLogo: {
      width: number
    }
  }

  keyboardDidShowListener: Object
  keyboardDidHideListener: Object

  constructor (props: SignupScreenProps) {
    super(props)
    this.state = {
      email: '',
      password1: '',
      password2: '',
      visibleHeight: Metrics.screenHeight,
      topLogo: { width: Metrics.screenWidth }
    }
  }

  componentWillMount () {
    // Using keyboardWillShow/Hide looks 1,000 times better, but doesn't work on Android
    // TODO: Revisit this if Android begins to support - https://github.com/facebook/react-native/issues/3468
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  keyboardDidShow = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    let newSize = Metrics.screenHeight - e.endCoordinates.height
    this.setState({
      visibleHeight: newSize,
      topLogo: {width: 100, height: 70}
    })
  }

  keyboardDidHide = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({
      visibleHeight: Metrics.screenHeight,
      topLogo: {width: Metrics.screenWidth}
    })
  }

  handlePressSignup= () => {
    const { email, password1, password2 } = this.state
    this.props.attemptSignup(email, password1, password2)
  }

  handleChangeEmail= (text) => {
    this.setState({ email: text })
  }

  handleChangePassword1 = (text) => {
    this.setState({ password1: text })
  }

  handleChangePassword2 = (text) => {
    this.setState({ password2: text })
  }

  render () {
    const { email, password1, password2 } = this.state
    const { fetching } = this.props
    const editable = !fetching
    const textInputStyle = editable ? Styles.textInput : Styles.textInputReadonly
    return (
      <Container>
        <CommonHeader title={I18n.t('Sign Up')} />
        <Content contentContainerStyle={Styles.center} style={[Styles.container]} keyboardShouldPersistTaps='always'>
          <NamedLogo />
          <View style={Styles.form}>
            <View style={Styles.row}>
              <Text style={Styles.rowLabel}>{I18n.t('email')}</Text>
              <TextInput
                ref='email'
                style={textInputStyle}
                value={email}
                editable={editable}
                keyboardType='email-address'
                returnKeyType='next'
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={this.handleChangeEmail}
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.refs.password1.focus()}
                placeholder={I18n.t('email')} />
              <Text style={Styles.errorLabel}>
                { (this.props.error && this.props.error.email) ? this.props.error['email'][0] : ''}
              </Text>
            </View>

            <View style={Styles.row}>
              <Text style={Styles.rowLabel}>{I18n.t('Password')}</Text>
              <TextInput
                ref='password1'
                style={textInputStyle}
                value={password1}
                editable={editable}
                keyboardType='default'
                returnKeyType='go'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry
                onChangeText={this.handleChangePassword1}
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.refs.password2.focus()}
                placeholder={I18n.t('Password')} />
              <Text style={Styles.errorLabel}>
                { (this.props.error && this.props.error.password1) ? this.props.error['password1'][0] : ''}
              </Text>
            </View>

            <View style={Styles.row}>
              <Text style={Styles.rowLabel}>{I18n.t('Repeat Password')}</Text>
              <TextInput
                ref='password2'
                style={textInputStyle}
                value={password2}
                editable={editable}
                keyboardType='default'
                returnKeyType='go'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry
                onChangeText={this.handleChangePassword2}
                underlineColorAndroid='transparent'
                onSubmitEditing={this.handlePressLogin}
                placeholder={I18n.t('Password')} />
              <Text style={Styles.errorLabel}>
                { (this.props.error && this.props.error.password2) ? this.props.error['password2'][0] : ''}
              </Text>
            </View>
            <Text style={Styles.errorLabel}>
              { (this.props.error && this.props.error.non_field_errors) ? this.props.error['non_field_errors'][0] : ''}
            </Text>

            <View style={[Styles.loginRow]}>
              <TouchableOpacity style={Styles.loginButtonWrapper} onPress={this.handlePressSignup}>
                <View style={Styles.loginButton}>
                  <Text style={Styles.loginText}>{I18n.t('Sign Up')}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={Styles.loginButtonWrapper} onPress={NavigationActions.pop}>
                <View style={Styles.loginButton}>
                  <Text style={Styles.loginText}>{I18n.t('cancel')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

        </Content>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fetching: state.login.fetching,
    error: state.login.signupError
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptSignup: (email, password1, password2) => dispatch(LoginActions.signupRequest(email, password1, password2))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen)
