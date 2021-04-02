<template>
  <div class="container">
    <div class="container-header">
      <h2>商品管理</h2>
    </div>
    <!-- 添加商品按钮 -->
    <el-row>
      <el-col :span="2"><div class="container-btn"></div></el-col>
      <el-col :span="20">
        <div class="container-btn bg-btn">
          <AddProduct :loadTableAndProductPage="loadTableAndProductPage"></AddProduct>
        </div>
      </el-col>
      <el-col :span="2"><div class="container-btn"></div></el-col>
    </el-row>
    <!-- 编辑表单 -->
    <el-dialog title="编辑商品" :visible.sync="dialogFormVisible">
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
    <!-- 商品列表 -->
    <el-row>
      <el-col :span="2"><div class="container-table"></div></el-col>
      <el-col :span="20">
        <div class="container-table bg-table">
          <el-container>
            <el-header>
              <el-pagination
                  :page-size="5"
                  background
                  layout="prev, pager, next"
                  :total="total_item"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
              />
              <div class="container-table-select">
                <el-select @change="typeSearch" v-model="select_type" placeholder="分类">
                  <el-option v-for="(item, index) in type_list" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
                </el-select>
              </div>
            </el-header>
            <el-main>
              <el-table :data="tableData" style="width: 100%">

                <el-table-column align="center" label="游戏名称" width="180">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">
                      <el-tag size="medium">{{ scope.row.title }}</el-tag>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column align="center" label="图片缩略图" width="200">
                  <template slot-scope="scope">
                    <img :src="scope.row.img" alt="">
                  </template>
                </el-table-column>

                <el-table-column align="center" label="原价" width="120">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.ori_price | moneyFormat }}</span>
                  </template>
                </el-table-column>

                <el-table-column align="center" label="现价" width="120">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.cur_price | moneyFormat }}</span>
                  </template>
                </el-table-column>

                <el-table-column align="center" label="折扣" width="120">
                  <template slot-scope="scope">
                    <span v-if="scope.row.discount" style="margin-left: 10px">-{{ scope.row.discount * 100 }}%</span>
                    <span v-else style="margin-left: 10px">无优惠</span>
                  </template>
                </el-table-column>

                <el-table-column align="center" label="分类" width="180">
                  <template slot-scope="scope">
                    <span v-if="scope.row.type === 1" style="margin-left: 10px">限时折扣</span>
                    <span v-if="scope.row.type === 2" style="margin-left: 10px">热门佳作</span>
                    <span v-if="scope.row.type === 3" style="margin-left: 10px">国产</span>
                    <span v-if="scope.row.type === 4" style="margin-left: 10px">新作</span>
                    <span v-if="scope.row.type === 5" style="margin-left: 10px">剧情丰富</span>
                  </template>
                </el-table-column>

                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
            <el-footer>
              <el-pagination :page-size="5" background layout="prev, pager, next" :total="total_item" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"/>
            </el-footer>
          </el-container>
        </div>
      </el-col>
      <el-col :span="2"><div class="container-table"></div></el-col>
    </el-row>
  </div>
</template>

<script>
import {getProductList, delProduct, getProductById, editProduct, getProductPage} from "@/service/api";
import AddProduct from "@/views/admin/AdminDashBoard/AddProduct";

export default {
  image_url: "ProductControl",
  components: {
    AddProduct
  },
  data() {
    return {
      tableData: [],
      product_id: '',
      total_item: 0,  // 总条数
      currentPage: 0,  // 当前页数
      page: 1,  // 初始显示第几页
      pageSize: 5,  // 每页显示多少条数据
      select_type: '',
      type_list: [
        {
          "typeId" : '',
          "typeName" : "全部",
        },
        {
          "typeId" : 1,
          "typeName" : "限时折扣",
        },
        {
          "typeId" : 2,
          "typeName" : "热门佳作",
        },
        {
          "typeId" : 3,
          "typeName" : "国产",
        },
        {
          "typeId" : 4,
          "typeName" : "新作",
        },
        {
          "typeId" : 5,
          "typeName" : "剧情丰富",
        }
      ],

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
  created() {
    this.loadTableAndProductPage();
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
    // 加载分类商品数量 和 分页数量
    loadTableAndProductPage() {
      // 重新加载分类商品数量
      this.getTableInfo();
      // 重新加载商品数量
      this.loadProductPage(this.select_type);
    },
    // 分类查询
    typeSearch() {
      // 返回第一页
      this.currentPage = 1;
      this.page = 1;
      this.loadTableAndProductPage();
    },
    // pageSize 改变时触发
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // 当前页数改变时会触发
    handleCurrentChange(val) {
      this.page = val;
      this.currentPage = val;
      this.getTableInfo();
    },
    async getTableInfo() {
      let that = this;
      let pageNum = that.page;
      let pageSize = that.pageSize;
      let type = that.select_type;
      let result = await getProductList(pageNum, pageSize, type);
      if (result.success_code === 200) {
        that.tableData = result.data;
      }
    },
    // 获取商品数量
    async loadProductPage(type = '') {
      let result = await getProductPage(type);
      this.total_item = result.result;
      console.log("total:", this.total_item);
    },
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.product_id = row._id;
      this.loadProductData(row._id);
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该轮商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delProduct(row._id);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.page = (this.total_item - 1) % 5 === 0 ? (this.total_item - 1) / 5 : this.page;
        console.log(this.page);
        this.loadTableAndProductPage();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    // 加载编辑商品的数据
    async loadProductData(product_id) {
      let result = await getProductById(product_id);
      this.numberValidateForm.title = result.result.title;
      this.numberValidateForm.img = result.result.img;
      this.numberValidateForm.ori_price = result.result.ori_price;
      this.cur_price = result.result.cur_price;
      this.numberValidateForm.discount = result.result.discount;
      this.numberValidateForm.type = result.result.type;
      this.numberValidateForm.developers = result.result.developers;
      this.numberValidateForm.publisher = result.result.publisher;
      this.numberValidateForm.pun_date = result.result.pun_date;
      this.numberValidateForm.language = result.result.language;
      this.numberValidateForm.system = result.result.system;
      this.numberValidateForm.content = result.result.content;
    },
    submitForm(formName) {
      let that = this;
      this.$refs[formName].validate(async valid => {
        if (valid) {
          await editProduct(
              that.product_id,
              that.numberValidateForm.title,
              that.numberValidateForm.img,
              that.numberValidateForm.ori_price,
              that.cur_price,
              that.numberValidateForm.discount,
              that.numberValidateForm.type,
              that.numberValidateForm.developers,
              that.numberValidateForm.publisher,
              that.numberValidateForm.pun_date,
              that.numberValidateForm.language,
              that.numberValidateForm.system,
              that.numberValidateForm.content
          );
          alert('商品修改成功！');
          that.dialogFormVisible = false;
          that.loadTableAndProductPage();
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
    position: relative;
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
    &-select {
      position: absolute;
      right: 20px;
      top: 2%;
    }
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
@media (max-width: 1366px) and (max-height: 768px) {
  .container {
  }
}
</style>