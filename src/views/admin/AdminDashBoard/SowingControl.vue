<template>
  <div class="container">
    <div class="container-header">
      <h2>轮播图管理</h2>
    </div>
    <!-- 添加轮播图按钮 -->
    <el-row>
      <el-col :span="2"><div class="container-btn"></div></el-col>
      <el-col :span="20">
        <div class="container-btn bg-btn">
          <AddSowing :sowingList="sowingList" :loadSowing="loadSowing"></AddSowing>
        </div>
      </el-col>
      <el-col :span="2"><div class="container-btn"></div></el-col>
    </el-row>
    <!-- 编辑表单 -->
    <el-dialog title="编辑轮播图" :visible.sync="dialogFormVisible">
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
    <!-- 轮播图列表 -->
    <el-row>
      <el-col :span="2"><div class="container-table"></div></el-col>
      <el-col :span="20">
        <div class="container-table bg-table">
          <el-container>
            <el-header></el-header>
            <el-main>
              <el-table :data="sowingList" style="width: 100%">

                <el-table-column align="center" label="图片名称" width="180">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">
                      <el-tag size="medium">{{ scope.row.image_title }}</el-tag>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column align="center" label="图片缩略图" width="180">
                  <template slot-scope="scope">
                    <img :src="scope.row.image_url" alt="">
                  </template>
                </el-table-column>

                <el-table-column align="center" label="跳转链接" width="180">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.image_link }}</span>
                  </template>
                </el-table-column>

                <el-table-column align="center" label="上架时间" width="180">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.s_time | dateFormat }}</span>
                  </template>
                </el-table-column>

                <el-table-column align="center" label="下架时间" width="180">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.e_time | dateFormat }}</span>
                  </template>
                </el-table-column>

                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <!-- 编辑表单 -->
                    <!--            <EditForm :loadSowing="loadSowing" :sowing_id="sowing_id"></EditForm>-->
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
            <el-footer></el-footer>
          </el-container>
        </div>
      </el-col>
      <el-col :span="2"><div class="container-table"></div></el-col>
    </el-row>
  </div>
</template>

<script>
import AddSowing from "@/views/admin/AdminDashBoard/AddSowing";
import { getSowingList, delSowing, getSowingById, editSowing } from "@/service/api";

export default {
  name: "SowingControl",
  components: {
    AddSowing,
  },
  created() {
    this.loadSowing();
  },
  data() {
    return {
      sowing_id: '',
      sowingList: [],

      formLabelWidth: '120px',
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
    // 加载数据
    async loadSowing() {
      let result = await getSowingList();
      this.sowingList = result.data;
    },
    // 编辑轮播图
    handleEdit(index, row) {
      this.sowing_id = row._id;
      this.dialogFormVisible = true;
      this.loadSowingData();
    },
    // 删除轮播图
    handleDelete(index, row) {
      let that = this;
      this.$confirm('此操作将永久删除该轮播图, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSowing(row._id);
        that.loadSowing();
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    // 加载当前轮播图数据
    async loadSowingData() {
      let result = await getSowingById(this.sowing_id);
      this.numberValidateForm.image_title = result.result.image_title;
      this.numberValidateForm.image_url = result.result.image_url;
      this.numberValidateForm.image_link = result.result.image_link;
      this.numberValidateForm.s_time = result.result.s_time;
      this.numberValidateForm.e_time = result.result.e_time;
    },
    // 修改表单
    submitForm(formName) {
      let that = this;
      this.$refs[formName].validate(async valid => {
        if (valid) {
          await editSowing(
              that.sowing_id,
              that.numberValidateForm.image_title,
              that.numberValidateForm.image_url,
              that.numberValidateForm.image_link,
              that.numberValidateForm.s_time,
              that.numberValidateForm.e_time
          );
          alert('轮播图修改成功！');
          this.dialogFormVisible = false;
          that.loadSowing();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 退出表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
  }
}
</script>


<style lang="scss" scoped>
.container {
  color: #0f4b69;
  &-header {
    width: 100%;
    height: 150px;
    background-color: #b8dcff;
    background-image: linear-gradient(62deg, #b8dcff 0%, #00ffff 100%);
    box-shadow: #7c7c7c 0 0 5px;
    h2 {
      color: #fff;
      line-height: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  &-btn {
    margin-top: -30px;
    border-radius: 10px;
    height: 100px;
    min-height: 36px;
  }
  &-table {
    margin-top: 30px;
    border-radius: 10px;
    min-height: 36px;
  }
}
.bg-btn {
  background-color: #fff;
  box-shadow: #cacaca 0 0 10px;
}
.bg-table {
  background-color: #fff;
  box-shadow: #cacaca 0 0 10px;
}
.el-header, .el-footer {
  color: #333;
  text-align: center;
  line-height: 60px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
}
.el-main {
  color: #333;
  text-align: center;
}
.el-header {
  padding-top: 20px;
}
@media (max-width: 1366px) and (max-height: 768px) {
  .container {
  }
}
</style>