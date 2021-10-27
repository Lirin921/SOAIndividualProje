<template>
  <div>
    <div class="title" style="font-size:40px">
      WUS City Database Online
    </div>
    <div class="SearchDiv">       
      <el-row>
        <el-input 
        clearable="true" 
        placeholder="请输入城市名" 
        v-model="message" 
        style="width:350px"       
        ></el-input> 
          <el-button 
            icon="el-icon-search" 
            circle medium 
            clearable="true" 
            @click="pageSwitch()" 
            type="primary">
        </el-button>
      </el-row>      
    </div>  
  </div>
</template>

<script>
export default {
  name: 'search',
  data() { 
      return {     
      message:'',
    }
  },

  mounted: function(){
  },
 
  methods:{ 

    //页面切换
    pageSwitch(){
      if(this.message.length>0){
        var reg = /[\u4e00-\u9fa5]/g;
			  if (!reg.test(this.message)){ 
				  alert("请输入中文");
          this.message='';
			  } else {
				  this.errorTips = true
          this.$router.push({
            name:'InfoPage',
            query:{
              cityName:this.message
            }
          });
        }
      }
    }, 
  }
}
</script>

<style scoped>  
  .SearchDiv{
    position:absolute;    
    
    left:30%;
    top:35%;
  }

  .title{
    position:absolute;    
    left:30%;
    top:25%;
    
  }
</style>>