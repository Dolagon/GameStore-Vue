<template>
  <div>
    <div class="add-sowing">
      <span>添加轮播图</span>
      <div @click="addSowingForm" class="add-sowing-btn"><img src="../images/add.png"></div>
    </div>
    <el-dialog title="添加轮播图" :visible.sync="dialogFormVisible">
      <el-form :model="numberValidateForm" ref="numberValidateForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="图片名称" prop="image_title" :rules="[{ required: true, message: '名称不能为空'}]">
          <el-input type="image_title" v-model="numberValidateForm.image_title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片地址" prop="image_url" :rules="[{ required: true, message: '地址不能为空'}]">
          <el-input type="image_url" v-model="numberValidateForm.image_url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <img style="width: 3rem;height: 1.5rem;" :src="numberValidateForm.image_url" alt="">
        </el-form-item>
        <el-form-item label="跳转链接" prop="image_link" :rules="[{ required: true, message: '跳转链接不能为空'}]">
          <el-input type="image_link" v-model="numberValidateForm.image_link" autocomplete="off"></el-input>
        </el-form-item>


        <el-form-item style="cursor: pointer" label="上架时间" prop="s_time" :rules="[{ required: true, message: '下架时间不能为空'}]">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="numberValidateForm.s_time" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item style="cursor: pointer" label="下架时间" prop="e_time" :rules="[{ required: true, message: '下架时间名称不能为空'}]">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="numberValidateForm.e_time" style="width: 100%;"></el-date-picker>
          </el-col>
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
import { addSowing } from "@/service/api";

export default {
  name: "AddSowing",
  props: {
    loadSowing: Function,
    sowingList: Array
  },
  data() {
    return  {
      dialogFormVisible: false,

      numberValidateForm: {
        image_title: '',
        image_url: '',
        image_link: '',
        s_time: '',
        e_time: ''
      }
    }
  },
  methods: {
    addSowingForm() {
      if (this.sowingList.length >= 5) {
        this.$alert('轮播图数量已达上限', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        });
      } else {
        this.dialogFormVisible = true;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          await addSowing(
              this.numberValidateForm.image_title,
              this.numberValidateForm.image_url,
              this.numberValidateForm.image_link,
              this.numberValidateForm.s_time,
              this.numberValidateForm.e_time
          );
          alert('轮播图添加成功！');
          this.dialogFormVisible = false;
          this.loadSowing();
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
  .add-sowing {
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