import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Alert,
  Image
} from 'react-native';
import CardStack, { Card } from 'react-native-card-stack-swiper';
import Tab from 'modules/generic/TabOptions';
import MenuCards from 'modules/menu/cards';
import { Color, BasicStyles } from 'common';
import Information from 'modules/menu/information';
import { ScrollView } from 'react-native-gesture-handler';
import FLoatingButton from 'modules/generic/CircleButton';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faTimes, faStar } from '@fortawesome/free-solid-svg-icons';
import Config from 'src/config.js';
import { Routes } from 'common';
import Api from 'services/api/index.js';
import { Spinner } from 'components';
import styles from './Swiper2Style';
import { connect } from 'react-redux';

const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);

class Cards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      choice: 'Menu',
      isLoading: true,
      index: 0,
      data: [],
      products: [],
      limit: 5,
      offset: 0
    }
  }


  choiceHandler = (value) => {
    this.setState({ choice: value })
  }

  componentDidMount() {
    this.retrieve();
  }

  retrieve = () => {
    let parameter = {
      condition: [{
        value: this.props.item.merchant.id,
        column: 'id',
        clause: '='
      }]
    }
    this.setState({ isLoading: true })
    Api.request(Routes.merchantOneRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.retrieveProducts();
        this.setState({ data: response.data[0] });
      }
    },
      error => {
        this.setState({ isLoading: false })
        console.log({ error });
      },
    );
  }

  retrieveProducts = () => {
    let parameter = {
      condition: [{
        value: this.props.item.merchant.id,
        column: 'merchant_id',
        clause: '='
      }],
      account_id: this.props.state.user.id,
      sort: { title: 'asc' },
      limit: this.state.limit,
      offset: this.state.offset,
      inventory_type: 'all'
    }
    this.setState({ isLoading: true })
    Api.request(Routes.productsRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.setState({ products: response.data });
      } else {
        this.setState({ products: [] })
      }
    },
      error => {
        this.setState({ isLoading: false })
        console.log({ error });
      },
    );
  }

  swipeHandler = () => {
    this.props.header(this.state.index >= this.state.data.length - 2 ? true : false);
    this.setState({ index: this.state.index + 1 === this.state.data.length ? 0 : this.state.index + 1 })
  }

  addToReservation = () => {
    let parameter = {
      account_id: this.props.state.user.id,
      merchant_id: this.props.item.merchant.id,
      payload: 'synqt',
      payload_value: this.props.item.synqt[0].id,
      details: this.props.item.synqt[0]?.details,
      datetime: this.props.item.synqt[0].date,
      status: 'pending'
    }
    this.props.onClose(null);
    this.props.navigation.navigate('eventNameStack', { parameter: parameter, buttonTitle: 'Make Reservation', data: this.props.item, messenger_group_id: this.props.messengerGroup?.messenger_group_id })
  }

  renderCard = (data) => {
    return (
      <View style={{ flex: 1 }}>
        <View style={{
          width: width,
          paddingLeft: 15,
          paddingRight: 15,
          height: height * 0.9
        }}>
          <Image style={{
              borderRadius: 3,
              width: '100%',
              height: '71%',
              resizeMode: 'stretch',
              marginTop: this.props.bottomFloatButton === true ? 50 : height * 0.25,
              backgroundColor: 'white'
            }}
            source={data && data.logo ? { uri: Config.BACKEND_URL + data.logo } : require('assets/default.png')} />
          {this.state.isLoading ? <Spinner mode="overlay" /> : null}
          <View style={{
            position: 'absolute',
            left: 10,
            bottom: this.props.topFloatButton === true ? 70 : 15,
            ...BasicStyles.standardWidth
          }}>
            <Text style={{
              fontSize: BasicStyles.standardTitleFontSize,
              color: 'white',
              fontWeight: 'bold',
              textShadowColor: 'black',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1,
              width: '50%'
            }}>{data && data.name && data.name || 'No data'}</Text>
            <Text style={{
              color: 'white',
              textShadowColor: 'black',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1,
              width: '50%'
            }}>{data && data.address && data.address && data.address || 'No address'}</Text>
          </View>
          <View style={{ position: 'absolute', bottom: 70, right: 25, flexDirection: 'row' }}>
            <FontAwesomeIcon
              icon={faStar}
              size={30}
              color={data.rating?.stars >= 1 ? '#FFCC00' : '#ededed'}
            />
            <FontAwesomeIcon
              icon={faStar}
              size={30}
              color={data?.rating?.stars >= 2 ? '#FFCC00' : '#ededed'}
            />
            <FontAwesomeIcon
              icon={faStar}
              size={30}
              color={data?.rating?.stars >= 3 ? '#FFCC00' : '#ededed'}
            />
            <FontAwesomeIcon
              icon={faStar}
              size={30}
              color={data?.rating?.stars >= 4 ? '#FFCC00' : '#ededed'}
            />
            <FontAwesomeIcon
              icon={faStar}
              size={30}
              color={data?.rating?.stars >= 5 ? '#FFCC00' : '#ededed'}
            />
          </View>
          {this.props.topFloatButton === true && (<View style={{
            ...BasicStyles.standardWidth,
            position: 'absolute',
            bottom: -30,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 70,
                height: 70,
                backgroundColor: Color.warning,
                borderRadius: 35,
                marginLeft: '4%'
              }}

              onPress={() => {
                this.props.onClose(null)
              }}
            >
              <FontAwesomeIcon
                icon={faTimes}
                size={35}
                color={'white'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                backgroundColor: Color.warning,
                borderRadius: 40
              }}
              onPress={() => {
                if (this.props.navigation.state?.params?.messenger_group_id?.status === 'ADMIN') {
                  this.addToReservation()
                } else {
                  Alert.alert(
                    "",
                    "Sorry you are not allowed to proceed to reservation.",
                    [
                      { text: "OK" }
                    ],
                    { cancelable: false }
                  );
                }
              }}
            >
              <FontAwesomeIcon
                icon={faCheck}
                size={40}
                color={'white'}
              />
            </TouchableOpacity>
          </View>)}
        </View>
        {this.renderMenu()}
      </View>
    )
  }

  renderMenu = () => {
    const { data } = this.state;
    return (
      <View
        style={{ padding: 20, marginTop: '5%' }}
      >
        <View>
          <View style={this.props.topFloatButton === true ? { marginTop: 30 } : { marginTop: 0 }}>
            <Tab level={1} choice={['Menu', 'Information']} onClick={this.choiceHandler}></Tab>
          </View>
          <View style={this.props.bottomFloatButton === true ? { marginBottom: 200 } : { marginBottom: 0 }}>
            {this.state.choice == 'Menu' ? (
              <View>
                <MenuCards data={this.state.products.length > 0 && this.state.products} />
                {this.state.products.length === 0 && (
                  <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 40
                  }}>
                    <Text>No available product.</Text>
                  </View>
                )}
              </View>
            ) :
              <Information
                name={this.state.data?.name || 'No data'}
                hours={this.state.data?.schedule}
                description={this.state.data?.addition_informations || 'No business information.'}
              />}
          </View>
        </View>
      </View>
    )
  }

  render() {
    const { isLoading } = this.state;
    return (
      <ScrollView showsVerticalScrollIndicator={true}
        style={{ backgroundColor: 'white' }}
      >
        {this.state.data && this.renderCard(this.state.data)}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({ state: state });

export default connect(mapStateToProps)(Cards);
