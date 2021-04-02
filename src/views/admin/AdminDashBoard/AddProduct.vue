<template>
  <div>
    <div class="add-product">
      <span>添加商品</span>
      <div @click="dialogFormVisible = true" class="add-product-btn"><img src="../images/add.png"></div>
    </div>
    <el-dialog title="添加商品" :visible.sync="dialogFormVisible">
      <el-form :model="numberValidateForm" ref="numberValidateForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="商品名称" prop="title" :rules="[{ required: true, message: '名称不能为空'}]">
          <el-input v-model="numberValidateForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片地址" prop="img" :rules="[{ required: true, message: '图片地址不能为空'}]">
          <el-input v-model="numberValidateForm.img" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <img style="width: 3rem;height: 1.5rem;" :src="numberValidateForm.img" alt="">
        </el-form-item>
        <el-form-item label="原价" prop="ori_price" :rules="[{ required: true, message: '价格不能为空'}]">
          <el-input v-model="numberValidateForm.ori_price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="现价" prop="cur_price" :rules="[{ required: false, message: '价格不能为空'}]">
          <el-input v-model="cur_price" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="折扣" prop="discount">
          <el-select v-model="numberValidateForm.discount" placeholder="无优惠">
            <el-option label="无优惠" value=""></el-option>
            <el-option label="-20%" value="0.2"></el-option>
            <el-option label="-50%" value="0.5"></el-option>
            <el-option label="-70%" value="0.7"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类" prop="type">
          <el-select v-model="numberValidateForm.type" placeholder="选择分类">
            <el-option label="限时折扣" value="1"></el-option>
            <el-option label="热门佳作" value="2"></el-option>
            <el-option label="国产" value="3"></el-option>
            <el-option label="新作" value="4"></el-option>
            <el-option label="剧情丰富" value="5"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="开发商" prop="developers">
          <el-input v-model="numberValidateForm.developers" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="发行商" prop="publisher">
          <el-input v-model="numberValidateForm.publisher" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item style="cursor: pointer" label="发行日期" prop="pun_date">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="numberValidateForm.pun_date" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item label="语言" prop="language">
          <el-input v-model="numberValidateForm.language" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="系统" prop="system">
          <el-select v-model="numberValidateForm.system" placeholder="选择系统平台">
            <el-option label="windows" value="windows"></el-option>
            <el-option label="Mac" value="Mac"></el-option>
            <el-option label="Linux" value="Linux"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="简介" prop="content">
          <el-input type="textarea" v-model="numberValidateForm.content" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('numberValidateForm')">提交</el-button>
          <el-button @click="resetForm('numberValidateForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { addProduct } from "@/service/api";

export default {
  name: "AddProduct",
  props: {
    loadTableAndProductPage: Function,
  },
  data() {
    return {
      dialogFormVisible: false,
      numberValidateForm: {
        title: '',
        img: '',
        ori_price: '',
        discount: '',
        type: '',
        developers: '',
        publisher: '',
        pun_date: '',
        language: '',
        system: '',
        content: ''
      }
    }
  },
  computed: {
    cur_price: {
      get() {
        if (this.numberValidateForm.discount === '') return this.numberValidateForm.ori_price;
        else return (this.numberValidateForm.ori_price * (1 - this.numberValidateForm.discount)).toFixed(0);
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if ( valid && this.numberValidateForm.title !== '') {
          let result = await addProduct(
              this.numberValidateForm.title,
              this.numberValidateForm.img,
              this.numberValidateForm.ori_price,
              this.cur_price,
              this.numberValidateForm.discount,
              this.numberValidateForm.type,
              this.numberValidateForm.developers,
              this.numberValidateForm.publisher,
              this.numberValidateForm.pun_date,
              this.numberValidateForm.language,
              this.numberValidateForm.system,
              this.numberValidateForm.content,
        );
          if (result.success_code === 200) {
            alert('添加成功');
            // 重新加载总页数
            this.loadTableAndProductPage();
            this.resetForm('numberValidateForm');
          } else {
            alert('添加商品失败!');
            console.log(result);
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.add-product{
  position: relative;
  float: right;
  height: 90px;
  width: 100%;
  border-radius: 10px;
  margin-top: 3px;
  span {
    position: absolute;
    line-height: 90px;
    font-size: 16px;
    top: 50%;
    right: 10%;
    transform: translate(-50%, -50%);
  }
  &-btn {
     margin-right: 30px;
     position: absolute;
     width: 50px;
     height: 50px;
     top: 50%;
     right: 0;
     transform: translate(-50%, -50%);
     background-color: #00a6ff;
     border-radius: 50%;
     cursor: pointer;
     transition: all 0.2s linear;
     box-shadow: 1px 2px 3px rgba(0, 0, 0, .15), 1px 2px 3px 1px rgba(0, 0, 0, .15);
  img {
    width: 30px;
    height: 30px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
&-btn:hover {
   border-radius: 10px;
   transition: border-radius 0.2s;
 }
}
@media (max-width: 768px) {
  span {
    visibility:hidden
  }
}
</style>