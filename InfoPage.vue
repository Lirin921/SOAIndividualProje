<template>
  <div>
    <head>
      <meta name="referrer" content="no-referrer" />
    </head>

    <div class="title" style="font-size:5%">
      WUS City Database Online
    </div>
    <div class="SearchDiv">       
      <el-row>
        <el-input 
        clearable="true" 
        placeholder="请输入城市名" 
        v-model="input" 
        style="width:350px"
        ></el-input> 
          <el-button 
            icon="el-icon-search" 
            circle medium 
            clearable="true" 
            @click="switchCity()" 
            type="primary">
        </el-button>
        <!--<el-button @click="test()" /-->
      </el-row>      
    </div>  
    
    <!--地图-->
    <el-container class="map">
      <el-main>
        <div style="position: relative; width: 100%; height: 100%">
          <div
            id="container"
            style="width: 100%; height: 100%; float: right"
          ></div>
          <div
            id="myPageTop"
            style="position: absolute; top: 20px; right: 50px; background: #fff"
          ></div>
        </div>
      </el-main>
    </el-container>



    <el-card class="main">
      <div style="font-size: 25px">
        <b>{{ aim_city }}</b>
      </div>
      <!--展示5个点-->
      <el-collapse
        v-model="activeNames"
        style="position: relative; width: 100%"
        accordion>

        <!--简介-->
        <el-collapse-item title="General Information" name="1">
          <el-card class="general">
            <p v-html="extract_html"></p>
            <el-image
              style="width: 80%; height: 100%; left: 10%"
              v-bind:src="this.city_image"
            />
          </el-card>
        </el-collapse-item>

        <!--显示房产信息-->
        <el-collapse-item title="Economy" name="2">
          <div style="font-size: 20px">
            <b>房产信息</b>
            <el-button-group style="position:absolute; right:10%;">
              <el-button
                @click="prevHouse()"
                type="primary"
                icon="el-icon-arrow-left"
                size="mini">
                上一个
              </el-button>
              <el-button 
                @click="nextHouse()" 
                type="primary" 
                size="mini">
                下一个<i class="el-icon-arrow-right el-icon--right"></i>
              </el-button>
            </el-button-group>
          </div>
          <el-container>
            <el-tabs v-model="activeName" type="card" class="houseInfo">
              <el-tab-pane label="名称" name="first">
                <p>{{ house[this.i].hourseName }}</p>
              </el-tab-pane>
              <el-tab-pane label="地址" name="second">
                <p>{{ house[this.i].hourseLocal }}</p>
              </el-tab-pane>
              <el-tab-pane label="物业公司" name="third">
                <p>{{ house[this.i].propertyCompany }}</p>
              </el-tab-pane>
              <el-tab-pane label="月租" name="fourth">
                <p>{{ house[this.i].monthPrice }}元</p>
              </el-tab-pane>
              <el-tab-pane label="其它" name="fifth">
                <p>
                  该建筑于{{ house[this.i].buildYear }}， 现有建筑{{
                    house[this.i].buildingCount
                  }}, 住户{{ house[this.i].hourseCount }}
                </p>
              </el-tab-pane>
            </el-tabs>
          </el-container>
          <el-divider></el-divider>
          <el-card class="house">
            <b>图片展示</b>
            <el-carousel
              height="250px"
              trigger="click"
              arrow="never"
              :autoplay="false">
              <el-carousel-item
                v-for="item in house[this.i].imgList.slice(0, 5)"
                :key="item">
                <el-image
                  style="width: 80%; height: 100%; left: 10%"
                  v-bind:src="item"/>
              </el-carousel-item>
            </el-carousel>
          </el-card>
        </el-collapse-item>

        <!--天气和空气-->
        <el-collapse-item title="Environment" name="3">
          <el-tabs tab-position="left" style="">
            <!--今日天气-->
            <el-tab-pane label="今日天气"><b>今日天气</b>
              <el-table :data="weather_today" stripe style="width: 100%">
                <el-table-column prop="date" label="日期" width="100">
                </el-table-column>
                <el-table-column prop="wea" label="天气情况" width="100">
                </el-table-column>
                <el-table-column label="气温/℃">
                  <el-table-column prop="tem_day" label="最高温度">
                  </el-table-column>
                  <el-table-column prop="tem_night" label="最低温度">
                  </el-table-column>
                </el-table-column>
                <el-table-column label="风况">
                  <el-table-column prop="win" label="风向"> </el-table-column>
                  <el-table-column prop="win_speed" label="风力">
                  </el-table-column>
                </el-table-column>
              </el-table>
              <el-card>
                <span style="font-size:20px"><b>空气质量</b></span>
                <div
                  style="positon:relative; width:80%">
                  <p><b>空气质量指数：</b>{{this.air_condition.aqi}}&ensp;&ensp;{{this.air_condition.category}} &ensp;&ensp;
                    <b> NO₂：</b>{{this.air_condition.no2}}
                  </p>
                  <p><b>PM10：</b>{{this.air_condition.pm10}}&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;
                    <b> SO₂：</b>{{this.air_condition.so2}}
                  </p>
                  <p><b>PM2.5：</b>{{this.air_condition.pm2p5}} &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                    <b> CO：</b>{{this.air_condition.co}}
                  </p>
                </div>
              </el-card>
            </el-tab-pane>

            <!--未来六天天气状况-->
            <el-tab-pane label="未来六天天气状况"
              ><b>未来六天天气状况</b>
              <el-table :data="weather_past" stripe style="width: 100%">
                <el-table-column prop="date" label="日期" width="100">
                </el-table-column>
                <el-table-column prop="wea" label="天气情况" width="100">
                </el-table-column>
                <el-table-column label="气温/℃">
                  <el-table-column prop="tem_day" label="最高温度">
                  </el-table-column>
                  <el-table-column prop="tem_night" label="最低温度">
                  </el-table-column>
                </el-table-column>
                <el-table-column label="风况">
                  <el-table-column prop="win" label="风向"> </el-table-column>
                  <el-table-column prop="win_speed" label="风力">
                  </el-table-column>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <!--未来天气预报-->
            <el-tab-pane label="未来四天天气预报">
              <b>未来四天天气预报</b>
              <el-table :data="weather_forecast.slice(1,5)" stripe style="width: 100%">
                <el-table-column prop="date" label="日期" width="100">
                </el-table-column>
                <el-table-column label="天气情况" width="100">
                  <el-table-column prop="day.type" label="白天">
                  </el-table-column>
                  <el-table-column prop="night.type" label="夜晚">
                  </el-table-column>
                </el-table-column>
                <el-table-column label="气温/℃">
                  <el-table-column prop="high" label="最高温度">
                  </el-table-column>
                  <el-table-column prop="low" label="最低温度">
                  </el-table-column>
                </el-table-column>
                <el-table-column label="风况">
                  <el-table-column label="白天">
                    <el-table-column prop="day.wind" label="风向">                     
                    </el-table-column>
                    <el-table-column prop="day.wind_speed" label="风力">
                    </el-table-column>
                  </el-table-column>
                  <el-table-column label="夜晚">
                    <el-table-column prop="night.wind" label="风向">                     
                    </el-table-column>
                    <el-table-column prop="night.wind_speed" label="风力">
                    </el-table-column>
                  </el-table-column>                 
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-collapse-item>

        <!--社会新闻-->
        <el-collapse-item title="Society" name="4">
          <div>
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                新闻类型<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="普通">普通</el-dropdown-item>
                <el-dropdown-item command="科技">科技</el-dropdown-item>
                <el-dropdown-item command="社会">社会</el-dropdown-item>
                <el-dropdown-item command="政治">政治</el-dropdown-item>
                <el-dropdown-item command="经济">经济</el-dropdown-item>
                <el-dropdown-item command="外交">外交</el-dropdown-item>
                <el-dropdown-item command="国际">国际</el-dropdown-item>
              </el-dropdown-menu>
          </el-dropdown>
            <label style="position:absolute; right:60%; color:blue">{{this.news_type}}</label>
          </div>
          <el-divider></el-divider>
          <!--新闻1-->
          <el-tooltip effect="light" :content="news[0].desc" placement="top">
            <el-link type="primary" :href="news[0].link"
              >{{ news[0].title }}></el-link
            >
          </el-tooltip>
          <!--新闻2-->
          <el-tooltip effect="light" :content="news[1].desc" placement="top">
            <el-link type="primary" :href="news[1].link"
              >{{ news[1].title }}></el-link
            >
          </el-tooltip>
          <!--新闻3-->
          <el-tooltip effect="light" :content="news[2].desc" placement="top">
            <el-link type="primary" :href="news[2].link"
              >{{ news[2].title }}></el-link
            >
          </el-tooltip>
          <!--新闻4-->
          <el-tooltip effect="light" :content="news[3].desc" placement="top">
            <el-link type="primary" :href="news[3].link"
              >{{ news[3].title }}></el-link
            >
          </el-tooltip>
          <!--新闻5-->
          <el-tooltip effect="light" :content="news[4].desc" placement="top">
            <el-link type="primary" :href="news[4].link"
              >{{ news[4].title }}></el-link
            >
          </el-tooltip>
        </el-collapse-item>

        <!--旅游景点-->
        <el-collapse-item title="Tourism" name="5">
          <el-table :data="scenic_spots" stripe style="width: 100%">
            <el-table-column prop="name" label="名称" width="180">
            </el-table-column>
            <el-table-column prop="price" label="票价/元" width="100">
            </el-table-column>
            <el-table-column prop="address" label="地址"> </el-table-column>
            <el-table-column prop="summary" label="简介"> </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  
  </div>
</template>

<script>
var map, placeSearch;

export default {
  name: "InfoPage",
  data() {
    return {
      input:'',
      //城市名字
      aim_city: this.$route.query.cityName + "",
      city_image: "",

      //防止地图抖动
      update: 0,
      /*
      //map
      zoom: "15",
      //地图中心
      center: [116.397428, 39.90923],
      //定位点标签
      label: {
        content: "",
        direction: "bottom",
        offset:[10,12]
      },
      map_visable: true,
      */
      //城市的ID
      locationID: 0,

      //General Information
      extract_html: "",

      //Economy
      house: [],
      activeName: "1",
      i: 0, //house下标
      //房产图片collapse names
      activeNames: ["1"],
      //信息选择
      activeName: "first",

      /*新闻*/
      news: [],
      news_type:"普通",

      /*旅游景点*/
      scenic_spots: [],

      /*过去六天天气*/
      weather_past: [],

      /*今日天气*/
      weather_today: {},

      /*天气预报*/
      weather_forecast:[{
        date:"",
        high:"",
        low:"",
        day:{
          type:"",
          wind:"",
          wind_speed:"",
        },
        night:{
          type:"",
          wind:"",
          wind_speed:"",
        }
      }],

      /*空气质量*/
      air_condition:"",

      xml: new DOMParser(),
    };
  },

  beforeCreate(){
    console.log(123);
  },

  mounted() {
    this.getCityLocation();
    this.getAirQuality();
    this.getGeneralInfo();
    this.getHouseProperty();
    this.getNews();
    this.getScenicSpot();
    this.getWeatherForecast();
    this.getWeekDayWeather();
    //console.log(this.update);
    this.getMap();
  },

  updated: function () {
    if (this.update < 2) {
      this.getMap();
      this.update++;
    }
  },

  methods: {
    //返回上一级
    switchCity() {
      if(this.input.length>0){
        var reg = /[\u4e00-\u9fa5]/g;
			  if (!reg.test(this.input)){ 
				  alert("请输入中文");
          this.input='';
			  } else {
          this.aim_city=this.input;         
          this.getCityLocation();
          this.getAirQuality();
          this.getGeneralInfo();
          this.getHouseProperty();
          this.getNews();
          this.getScenicSpot();
          this.getWeatherForecast();
          this.getWeekDayWeather();
          this.getMap();
        }      
      }      
    },
    
    //获取指定城市的经纬度及ID，选取返回数据组的第一个
    getCityLocation() {
      /*this.$axios
        .get("https://restapi.amap.com/v3/place/text?", {
          params: {
            key: "ac01e52c411f68aa9a5b05f5cd1df718",
            keywords: this.aim_city,
            city: this.aim_city,
            citylimit: true,
          },
        })
        .then((response) => {
          //console.log(response);
          this.center = response.data.pois[0].location;
          this.position = response.data.pois[0].location;
          this.label.content = this.aim_city;
        });
        */

      //获取locationID
      this.$axios
        .get("https://geoapi.qweather.com/v2/city/lookup?", {
          params: {
            key: "7334c4499c064022b725b40f9867d996",
            location: this.aim_city,
          },
        })
        .then((response) => {
          //console.log(response);
          this.locationID = response.data.location[0].id;
          this.getWeatherForecast();
          this.getAirQuality();
        });
      this.getAirQuality();
      this.getWeatherForecast();
    },

    //获取七天的天气情况
    getWeekDayWeather() {
      this.$axios
        .get("https://tianqiapi.com/free/week", {
          params: {
            appid: "16324867",
            appsecret: "F84G9vlE",
            cityid: this.locationID,
          },
        })
        .then((response) => {
          //console.log("过去七天");
          //console.log(response);
          this.weather_past = response.data.data.slice(1, 7);
          this.weather_today= response.data.data.slice(0,1);
          //console.log(this.weather_past);
        });
    },

    //获取天气预报，xml格式
    getWeatherForecast() {
      //console.log(this.locationID);
      this.$axios
        .get("http://wthrcdn.etouch.cn/WeatherApi?", {
          params: {
            citykey: this.locationID,
          },
        })
        .then((response) => {
          //console.log("天气预报");
          //console.log(response);
          this.xml = new DOMParser().parseFromString(response.data, "text/xml");
          this.translateXML();
          //console.log(this.xml);
        });
    },

    translateXML(){
      //console.log(this.weather_forecast);
      for(var index=1;index<5;index++){
        //console.log(index);
        var tmp=this.xml.getElementsByTagName("forecast")[0].getElementsByTagName("weather")[index];
        this.weather_forecast.push({
          date:tmp.getElementsByTagName("date")[0].childNodes[0].data,
          high:tmp.getElementsByTagName("high")[0].childNodes[0].data,
          low:tmp.getElementsByTagName("low")[0].childNodes[0].data,
          day:{
            type:tmp.getElementsByTagName("day")[0].getElementsByTagName("type")[0].childNodes[0].data,
            wind:tmp.getElementsByTagName("day")[0].getElementsByTagName("fengxiang")[0].childNodes[0].data,
            wind_speed:tmp.getElementsByTagName("day")[0].getElementsByTagName("fengli")[0].childNodes[0].data
            },
          night:{
            type:tmp.getElementsByTagName("night")[0].getElementsByTagName("type")[0].childNodes[0].data,
            wind:tmp.getElementsByTagName("night")[0].getElementsByTagName("fengxiang")[0].childNodes[0].data,
            wind_speed:tmp.getElementsByTagName("night")[0].getElementsByTagName("fengli")[0].childNodes[0].data
            },
        });
      }
      //console.log(this.weather_forecast);
    },

    //返回实时空气质量
    getAirQuality() {
      this.$axios
        .get("https://devapi.qweather.com/v7/air/now?", {
          params: {
            key: "7334c4499c064022b725b40f9867d996",
            location: this.locationID,
          },
        })
        .then((response) => {
          //console.log("空气质量");
          //console.log(response);
          this.air_condition=response.data.now;
          //console.log(this.air_condition);
        });
    },

    //返回新闻
    getNews() {
      this.$axios
        .post(
          "https://route.showapi.com/109-35?showapi_appid=797790&showapi_sign=c28f4f6af0c34dacaa70637c0283702d&title=" +
            this.aim_city
        )
        .then((response) => {
          //console.log(response);
          this.news = response.data.showapi_res_body.pagebean.contentlist.slice(0,5);
          //console.log(this.news);
        });
    },

    handleCommand(command) {
      if(command=="普通"){
        this.getNews();
        this.news_type="普通";
      } else {
        this.$axios
        .post(
          "https://route.showapi.com/109-35?showapi_appid=797790&showapi_sign=c28f4f6af0c34dacaa70637c0283702d&title=" +
            this.aim_city+command
        )
        .then((response) => {
          this.news = response.data.showapi_res_body.pagebean.contentlist.slice(0,5);
          this.news_type=command;
        });
      }
    },

    //返回房产信息
    getHouseProperty() {
      this.$axios
        .post(
          "https://route.showapi.com/1610-1?showapi_appid=797790&showapi_sign=c28f4f6af0c34dacaa70637c0283702d&cityName=" +
            this.aim_city
        )
        .then((response) => {
          //console.log(response);
          this.house = response.data.showapi_res_body.result.slice(0, 5);
          //console.log(this.house);
        });
    },

    //返回景点
    getScenicSpot() {
      this.$axios
        .post(
          "http://route.showapi.com/268-1?showapi_appid=797790&showapi_sign=c28f4f6af0c34dacaa70637c0283702d&keyword=" +
            this.aim_city
        )
        .then((response) => {
          //console.log(response);
          this.scenic_spots =
            response.data.showapi_res_body.pagebean.contentlist.slice(0, 5);
          //console.log(this.scenic_spots);
        });
    },

    //返回简介
    getGeneralInfo() {
      this.$axios
        .get("//zh.wikipedia.org/api/rest_v1/page/summary/" + this.aim_city)
        .then((response) => {
          //console.log(response);
          this.extract_html = response.data.extract_html;
          this.city_image = response.data.originalimage.source;
        });
    },

    //高德地图相关函数
    AMapInit: function () {
      map = new AMap.Map("container", {
        resizeEnable: true,
        zoom: 15,
        
      });
      AMap.service(["AMap.PlaceSearch"], function () {
        //构造地点查询类
        placeSearch = new AMap.PlaceSearch({
          pageSize: 5, // 单页显示结果条数
          pageIndex: 1, // 页码
          citylimit: false, //是否强制限制在设置的城市内搜索
          map: map, // 展现结果的地图实例
          //panel: "panel", // 结果列表将在此容器中进行展示。

          autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
          renderStyle: "default",
        });
      });
      // 添加列表点选监听事件
      AMap.event.addListener(placeSearch, "selectChanged", this.selectAddress);
    },
    searchAddress() {
      placeSearch.search(this.aim_city);
    },
    selectAddress(e) {
      //这里获得点选地点的经纬度
      let location = e.selected.data.location;
      //console.log("lng", location.lng);
      //console.log("lat", location.lat);
      // Do Something
    },

    getMap() {
      this.AMapInit();
      this.searchAddress();
    },

    nextHouse() {
      this.i++;
      if (this.i == this.house.length) this.i = 0;
    },
    prevHouse() {
      this.i--;
      if (this.i < 0) this.i = this.house.length;
    },

  },
};
</script>

<style scoped>
.SearchDiv{
  position: absolute;
  height: 6%;
  width: 50%;
}

/*折叠框*/
.main {
  position: absolute;
  width: 40%;
  top: 10%;
}
/*简介*/
.general {
  position: relative;
  width: 95%;
  background-color: rgb(235, 203, 202);
}

/*房产*/
.house {
  position: relative;
  width: 95%;
}
.houseInfo {
  position: relative;
  height: 100px;
  width: 95%;
}


/*地图*/
.map {
  position: absolute;
  width: 50%;
  height: 80%;
  right: 5%;
  top: 10%;
}
</style>
