<template>
  <div>
    <div>
      <div style="margin: 2% 0; display: inline-block">
        <el-input
          style="width: 150px"
          @keydown.enter.native="selectLink"
          clearable
          placeholder="请输入手机号"
          v-model="selectObj.linkPhone"
        >
        </el-input>
      </div>
      <div style="display: inline-block">
        <el-button
          style="margin-left: 15px"
          size="mini"
          type="primary"
          icon="document"
          @click="selectLink"
          >查询推荐链</el-button
        >
        <el-button
          style="margin-left: 15px"
          size="mini"
          type="primary"
          icon="document"
          @click="()=>{this.selectObj.linkPhone = ''}"
          >重置</el-button
        >
      </div>
      <div v-if="linkUserList.length>0">
        <span v-for="(item,index) in linkUserList">
          {{"【"+(item.gradeLevel?gradeConfigList.find(a => a.gradeCode === item.gradeLevel).gradeName:'未设置')+"】"+item.nickName+"【"+item.phone+"】-"}}
        </span>
      </div>
    </div>
    <div>
      <div style="margin: 2% 0; display: inline-block">
        <el-input
          style="width: 150px"
          @keydown.enter.native="select"
          clearable
          placeholder="请输入手机号"
          v-model="selectObj.phone"
        >
        </el-input>
      </div>
      <div style="display: inline-block">
        <el-button
          style="margin-left: 15px"
          size="mini"
          type="primary"
          icon="document"
          @click="select"
          >查询</el-button
        >
        <el-button
          style="margin-left: 15px"
          size="mini"
          type="primary"
          icon="document"
          @click="cleans"
          >重置</el-button
        >
      </div>
      <el-tree v-if="type" node-key="id" :props="props" :load="loadNode1" lazy>
      </el-tree>
    </div>
  </div>
</template>

<script>
const defaultSelect = {
  id: null,
  nickName: null,
  phone: null,
  linkPhone: ''
};
export default {
  name: "findTeamUserList",
  props: {
    gradeConfigList: {
      type: Array,
      default: [],
      required: true
    }
  },
  data() {
    return {
      props: {
        label: "label",
        children: "children",
        isLeaf: "isLeaf"
      },
      selectObj: Object.assign({}, defaultSelect),
      type: true,
      label: [],
      linkUserList:[],
    };
  },
  methods: {
    loadNode1(node, resolve) {
      const id = this.selectObj.id;
      if (node.level > 0) {
        this.findTeamUserList(node.data.id).then(data => {
          resolve(data);
        });
      } else if (node.level === 0 && id > 0) {
        // return resolve([{ id, label: "ID: " + id }]);
        return resolve(this.label);
      } else {
        return resolve([{ id: 1, label: "总账号【唯一】" }]);
      }
    },

    /* 查询团队结构 */
    findTeamUserList(id) {
      if (!id) {
        return console.error("!id");
      }
      return new Promise(resolve => {
        this.$http({
          url: this.$http.adornUrl2(`grade/findTeamUserList/${id}`)
        }).then(({ data }) => {
          let userList = [];
          if (data && data.data) {
            const length = data.data.length;
            for (let i = 0; i < length; i++) {
              const { id, nickName, phone, gradeLevel } = data.data[i];
              const gradeName = gradeLevel
                ? this.gradeConfigList.find(a => a.gradeCode === gradeLevel).gradeName
                : "未设置";
              userList.push({
                id,
                label: `【${gradeName}】${nickName}【${phone}】`,
                leaf: true
              });
            }
          } else {
            userList.length = 0;
          }
          resolve(userList);
        });
      });
    },

    select() {
      if (this.selectObj.phone.length == 11) {
        this.dataSelect();
      } else {
        this.$message({
          message: "请输入11位手机号",
          type: "error",
          duration: 2500
        });
      }
    },
    selectLink() {
      if (this.selectObj.linkPhone.length == 11) {
        const phone = this.selectObj.linkPhone;
        this.$http({
          url: this.$http.adornUrl2(`/user/userList/0/1`),
          method: "get",
          params: this.$http.adornParams({
            phone,
            platform: "all",
            isRelation: -1,
            isTuan: -1
          })
        }).then(({ data }) => {
          const user = data.data.content[0];
          const { id, nickName, phone, gradeLevel } = user;
          this.$http({
            url: this.$http.adornUrl2(`/grade/findTeamUserLink/${id}`),
            method: "get",
            params: this.$http.adornParams({})
          }).then(({data})=>{
            this.linkUserList = data.data;
          })
        });
      } else {
        this.$message({
          message: "请输入11位手机号",
          type: "error",
          duration: 2500
        });
      }
    },

    /* 获取数据列表 */
    dataSelect() {
      let phone = -1;
      if (this.selectObj.phone) {
        phone = this.selectObj.phone;
      }
      this.$http({
        url: this.$http.adornUrl2(`/user/userList/0/1`),
        method: "get",
        params: this.$http.adornParams({
          phone,
          platform: "all",
          isRelation: -1,
          isTuan: -1
          // nickName: "",
        })
      }).then(({ data }) => {
        const user = data.data.content[0];
        const { id, nickName, phone, gradeLevel } = user;
        const gradeName = gradeLevel
          ? this.gradeConfigList.find(a => a.gradeCode === gradeLevel)
            ? this.gradeConfigList.find(a => a.gradeCode === gradeLevel)
                .gradeName
            : "获取失败"
          : "未设置";
        this.selectObj.id = id;
        this.label = [
          { id, label: `【${gradeName}】${nickName}【${phone}】`, leaf: true }
        ];
        this.reloadTree();
      });
    },

    cleans() {
      this.selectObj = Object.assign({}, defaultSelect);
      this.reloadTree();
    },

    reloadTree() {
      this.type = false;
      this.nextTick(
        setTimeout(() => {
          this.type = true;
        }, 175)
      );
    }
  }
};
</script>
