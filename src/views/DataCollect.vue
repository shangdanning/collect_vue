<template>
    <div class="mainContent">
        <div class="side">
            <div class="side-nav-menu source-menu mappingSpecial" :class="{ active: currentType == 'DataSource' }" @click="Switch('DataSource')">
                <i class="menu-icon"></i>
                <span class="menu-text">数据源配置</span>
            </div>
              <div  class="side-nav-menu mapping" @click="goToDataMapping"><span>字段映射</span></div>
            <div class="side-nav-menu task-menu" :class="{ active: currentType == 'ColleckConfig' }" @click="Switch('ColleckConfig')">
                <i class="menu-icon"></i>
                <span class="menu-text">采集任务配置</span>
            </div>
          
            <div class="side-nav-menu manage-menu" :class="{ active: currentType == 'CentralManage' }" @click="Switch('CentralManage')">
                <i class="menu-icon"></i>
                <span class="menu-text">中心管理配置</span>
            </div>
        </div>
        <div class="body-main">
            <!--数据源配置 start-->
            <div class="collectContent" v-if="currentType == 'DataSource'" key="DataSource">
                <h5 class="h5-title">数据源配置</h5>
                <div class="btn-box">
                    <div style="margin-bottom:15px">
                        <el-button type="primary" size="small" id="addBtn" @click="sourceAddClick()">新增</el-button>
                        <el-button type="danger" size="small" @click="openDeleteDialog()">删除</el-button>
                    </div>
                    <el-form :model="querySourceForm" ref="querySourceForm" :inline="true" size="small">
                        <el-form-item label="数据源名称：">
                            <el-input style="width:160px" v-model="querySourceForm.datasourceName" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="数据源种类：">
                            <el-select style="width:160px" v-model="querySourceForm.datasourceType" clearable placeholder="请选择数据源种类">
                                <el-option label="FTP" value="ftp"></el-option>
                                <el-option label="kafka" value="kafka"></el-option>
                                <el-option label="数据库" value="database"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="IP：">
                            <el-input style="width:150px" v-model="querySourceForm.ip" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="输入输出：">
                            <el-select style="width:160px" v-model="querySourceForm.outOrIn" clearable placeholder="请选择输入输出">
                                <el-option label="输出" value="0"></el-option>
                                <el-option label="输入" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="querySourceData('query')">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="table-box">
                    <el-table ref="sourceTable" :data="tableData.sourceData" tooltip-effect="dark" style="width: 100%;" @selection-change="sourceSelectionChange" size='small' header-row-class-name='tableheader' :max-height="getMaxHeight()">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column label="序号"  align="center" width="120" type="index" :index="sourceIndexMethod">
                        </el-table-column>
                        <el-table-column prop="datasourceName" label="数据源名称" align="center"></el-table-column>
                        <el-table-column label="数据源种类"  align="center" >
                            <template slot-scope="scope">{{ getDataType(scope.row.datasourceType) }}</template>
                        </el-table-column>
                        <el-table-column prop="ip" label="IP" align="center"></el-table-column>
                        <el-table-column label="输入输出"  align="center" width="120">
                            <template slot-scope="scope">{{ scope.row.outOrIn == 1 ? '输入' : (scope.row.outOrIn == 0 ? '输出' : '') }}</template>
                        </el-table-column>
                        <el-table-column label="操作"  align="center">
                            <template slot-scope="scope">
                                <span class="table-icon icon-editor" @click="sourceEdit(scope.row)" title="编辑"></span>
                                <span class="table-icon icon-delect" @click="openDeleteDialog(scope.row)" title="删除"></span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        v-if="sourceTotalRow > 0"
                        background
                        @size-change="sourceHandleSizeChange"
                        @current-change="sourceHandleCurrentChange"
                        :current-page="sourcePage.currentPage"
                        :page-sizes="[10, 20, 50]"
                        :page-size="sourcePage.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="sourceTotalRow" style="text-align:right;margin-top: 10px;">
                    </el-pagination>
                </div>
            </div>
            <!--数据源配置 end-->

            <!--采集任务配置 start-->
            <div class="collectContent" v-if="currentType == 'ColleckConfig'" key="ColleckConfig">
                <h5 class="h5-title">采集任务配置</h5>
                <div class="btn-box">
                    <div style="margin-bottom:15px">
                        <el-button type="primary" size="small" id="addBtn" @click="taskAddClick()">新增</el-button>
                        <el-button type="danger" size="small" @click="openDeleteDialog()">删除</el-button>
                    </div>
                    <el-form :model="queryTaskForm" ref="queryTaskForm" :inline="true" size="small">
                        <el-form-item label="任务名称：">
                            <el-input style="width:160px" v-model="queryTaskForm.taskName" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="采集种类：">
                            <el-select style="width:160px" v-model="queryTaskForm.sourceType" clearable placeholder="请选择采集种类">
                                <el-option label="FTP" value="ftp"></el-option>
                                <el-option label="kafka" value="kafka"></el-option>
                                <el-option label="数据库" value="database"></el-option>
                                <el-option label="文件" value="staticFile"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="运行状态：">
                            <el-select style="width:160px" v-model="queryTaskForm.runStatus" clearable placeholder="请选择运行状态">
                                <el-option label="停运" value="0"></el-option>
                                <el-option label="运行中" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="_getTaskDataList('query')">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="table-box">
                    <el-table ref="taskTable" :data="tableData.taskData" tooltip-effect="dark" style="width: 100%;" @selection-change="taskSelectionChange" size='small' header-row-class-name='tableheader' :max-height="getMaxHeight()">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column label="序号"  align="center" width="120" type="index" :index="taskIndexMethod">
                        </el-table-column>
                        <el-table-column prop="taskName" label="任务名称"  align="center" width="120"></el-table-column>
                        <el-table-column label="来源类型" align="center">
                            <template slot-scope="scope">{{ getDataType(scope.row.sourceType) }}</template>
                        </el-table-column>
                        <el-table-column label="输出类型"  align="center">
                            <template slot-scope="scope">{{ getDataType(scope.row.destType) }}</template>
                        </el-table-column>
                        <el-table-column label="平均接入量(近10秒)"  align="center">
                            <template slot-scope="scope"><span>{{ scope.row.throughput.toLocaleString() || 0 }}</span></template>
                        </el-table-column>
                        <el-table-column label="数据类型"  align="center">
                            <template slot-scope="scope"><span>{{ CollectMappingObj[scope.row.dataTypeId] }}</span></template>
                        </el-table-column>
                        <el-table-column label="采集总量"  align="center">
                            <template slot-scope="scope"><span>{{ scope.row.amount.toLocaleString() || 0 }}</span></template>
                        </el-table-column>
                        <el-table-column label="运行状态"  align="center">
                            <template slot-scope="scope"><span :class="{ red: scope.row.runStatus !=1, green: scope.row.runStatus == 1}">{{ scope.row.runStatus == 1 ? '运行中' : scope.row.runStatus == 0 ? '停运' : '异常' }}</span></template>
                        </el-table-column>
                        <el-table-column label="操作"  align="center">
                            <template slot-scope="scope">
                                <span class="table-icon" @click="startOrStop(scope.row)" :class="{ 'icon-pause': scope.row.runStatus == 1, 'icon-operation': scope.row.runStatus !=1}" :title="scope.row.runStatus == 1 ? '暂停' : '运行'"></span>
                                <span class="table-icon icon-editor" @click="taskEdit(scope.row)" title="编辑"></span>
                                <span class="table-icon icon-delect" @click="openDeleteDialog(scope.row)" title="删除"></span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        v-if="taskTotalRow > 0"
                        background
                        @size-change="taskHandleSizeChange"
                        @current-change="taskHandleCurrentChange"
                        :current-page="taskPage.currentPage"
                        :page-sizes="[10, 20, 50]"
                        :page-size="taskPage.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="taskTotalRow" style="text-align:right;margin-top: 10px;">
                    </el-pagination>
                </div>
            </div>
            <!--采集任务配置 end-->
            
            <!--中心管理配置 start-->
            <div class="manageContent" v-if="currentType == 'CentralManage'" key="CentralManage">
                <h5 class="h5-title">中心管理配置</h5>
                <div class="service-address">
                    <div class="head-text">中心服务地址</div>
                    <div class="input-box">
                        <el-input type="text" placeholder="" v-model="centralService"/>
                        <span class="delect-icon" @click="clearCentralService()">&times;</span>
                    </div>
                    <button class="btn btn-blue" @click="modifyCentralService()">修改</button>
                </div>
            </div>
            <!--中心管理配置 end-->
        </div>

        <!--新增数据源弹框 start-->
        <el-dialog :title="isSourceEdit?'修改数据源配置':'新增数据源配置'" :visible.sync="sourceDialog" width='680px' custom-class='addDialog' @closed="clearSourceData">
        <el-form :model="addSourceForm" :rules="addSourceRules" ref="addSourceForm" size="mini" label-width="120px">
            <el-form-item label="数据源名称：" prop="datasourceName">
                <el-input v-model="addSourceForm.datasourceName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="数据源种类：" prop="datasourceType">
                <el-select v-model="addSourceForm.datasourceType" placeholder="数据源种类" @change="sourceTypeChange()">
                    <el-option label="FTP" value="ftp"></el-option>
                    <el-option label="kafka" value="kafka"></el-option>
                    <el-option label="数据库" value="database"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <!--FTP start-->
        <el-form :model="addSourceForm.ftpForm" :rules="ipPortRules" ref="addSourceFormFtp" key="addSourceFormFtp" size="mini" label-width="120px" v-if="addSourceForm.datasourceType == 'ftp'">
            <el-form-item label="IP：" prop="ip">
                <el-input v-model="addSourceForm.ftpForm.ip" auto-complete="off" placeholder="请输入IP地址"></el-input>
            </el-form-item>
            <el-form-item label="端口号：" prop="port">
                <el-input v-model="addSourceForm.ftpForm.port" auto-complete="off" placeholder="请输入端口号"></el-input>
            </el-form-item>
            <div style="overflow:hidden;">
                <el-col :span="12">
                    <el-form-item label="用户名：">
                        <el-input v-model="addSourceForm.ftpForm.userName" auto-complete="off" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="密码：">
                        <el-input type="password" v-model="addSourceForm.ftpForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
                    </el-form-item>
                </el-col>
            </div>
            <!-- <el-form-item label="文件目录：">
                <el-input v-model="addSourceForm.ftpForm.fileDirectory" auto-complete="off" placeholder="请输入文件目录"></el-input>
            </el-form-item> -->
            <el-form-item label="输入输出：" prop="outOrIn">
                <el-radio-group v-model="addSourceForm.ftpForm.outOrIn" size="small">
                    <el-radio label="1">输入</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <!--FTP end-->
        <!--kafka start-->
        <el-form :model="addSourceForm.kafkaForm" :rules="ipPortRules" ref="addSourceFormKafka" key="addSourceFormKafka" size="mini" label-width="120px" v-if="addSourceForm.datasourceType == 'kafka'">
            <el-form-item label="IP：" prop="ip">
                <el-input v-model="addSourceForm.kafkaForm.ip" auto-complete="off" placeholder="请输入IP"></el-input>
            </el-form-item>
            <el-form-item label="端口：" prop="port">
                <el-input v-model="addSourceForm.kafkaForm.port" auto-complete="off" placeholder="请输入端口"></el-input>
            </el-form-item>
            <el-form-item label="输入输出：" prop="outOrIn">
                <el-radio-group v-model="addSourceForm.kafkaForm.outOrIn" size="small">
                    <el-radio label="1">输入</el-radio>
                    <el-radio label="0">输出</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="分组ID：">
                <el-input v-model="addSourceForm.kafkaForm.groupId" auto-complete="off" placeholder="请输入分组ID"></el-input>
            </el-form-item>
        </el-form>
        <!--kafka end-->
        <!--数据库 start-->
        <el-form :model="addSourceForm.dbForm" :rules="ipPortRules" ref="addSourceFormDb" key="addSourceFormDb" size="mini" label-width="120px" v-if="addSourceForm.datasourceType == 'database'">
            <el-form-item label="数据库类型：">
                <el-select v-model="addSourceForm.dbForm.databaseType" placeholder="请选择数据库类型">
                    <el-option label="mysql" value="mysql"></el-option>
                    <el-option label="sqlserver" value="sqlserver"></el-option>
                    <el-option label="oracle" value="oracle"></el-option>
                </el-select>
            </el-form-item>
            <div style="overflow:hidden;">
                <el-col :span="12">
                    <el-form-item label="数据库IP：" prop="ip">
                        <el-input v-model="addSourceForm.dbForm.ip" auto-complete="off" placeholder="请输入数据库IP"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="端口号：" prop="port">
                        <el-input v-model="addSourceForm.dbForm.port" auto-complete="off" placeholder="请输入端口号"></el-input>
                    </el-form-item>
                </el-col>
            </div>
            <el-form-item label="库名：">
                <el-input v-model="addSourceForm.dbForm.databaseName" auto-complete="off" placeholder="请输入库名"></el-input>
            </el-form-item>
            <div style="overflow:hidden;">
                <el-col :span="12">
                    <el-form-item label="用户名：">
                        <el-input v-model="addSourceForm.dbForm.userName" auto-complete="off" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="密码：">
                        <el-input type="password" v-model="addSourceForm.dbForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
                    </el-form-item>
                </el-col>
            </div>
            <el-form-item label="输入输出：" prop="outOrIn">
                <el-radio-group v-model="addSourceForm.dbForm.outOrIn" size="small">
                    <el-radio label="1">输入</el-radio>
                    <el-radio label="0">输出</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <!--数据库 end-->
        <div slot="footer" class="dialog-footer">
            <button class="btn btn-blue" @click="saveAddEditSource()">保 存</button>
            <button class="btn" @click="cancleAddSource()">取 消</button>
        </div>
        </el-dialog>
        <!--新增数据源弹框 end-->

        <!--新增任务弹框 start-->
        <el-dialog :title="isTaskEdit?'修改任务配置':'新增任务配置'" :visible.sync="taskDialog" width='680px' custom-class='addDialog' @closed="clearTaskData">
        <el-form :model="addTaskForm" :rules="addTaskRules" ref="addTaskForm" size="mini" label-width="155px">
            <el-form-item label="任务名称：" prop="taskName">
                <el-input v-model="addTaskForm.taskName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="数据类型：" prop="dataTypeId">
                <el-select v-model="addTaskForm.dataTypeId" filterable placeholder="请选择数据类型">
                    <el-option
                    v-for="item in CollectMappingList"
                    :key="item.dataTypeId"
                    :label="item.dataTypeName"
                    :value="item.dataTypeId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="来源类型：" prop="sourceType">
                <el-select v-model="addTaskForm.sourceType" placeholder="请选择采集来源种类" @change="taskTypeChange('source')">
                    <el-option label="FTP" value="ftp"></el-option>
                    <el-option label="kafka" value="kafka"></el-option>
                    <el-option label="数据库" value="database"></el-option>
                    <el-option label="文件" value="staticFile"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="数据来源：" prop="sourceId" key="taskSourceId" v-if="addTaskForm.sourceType && addTaskForm.sourceType !== 'staticFile'">
                <el-select v-model="addTaskForm.sourceId" placeholder="请选择数据来源">
                    <el-option v-for="item in sourceIdList" :key="item.id" :label="item.datasourceName" :value="item.id">
                        <span style="float: left">名称: {{ item.datasourceName }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px;padding-right: 25px;">IP: {{ item.ip }}</span>
                        <!-- <span style="float: left">{{ item.outOrIn == 1 ? '输入' : (item.outOrIn == 0 ? '输出' : '') }}</span> -->
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="采集kafka主题：" prop="sourceTopic" key="taskSourceTopic" v-if="addTaskForm.sourceType == 'kafka'">
                <el-input v-model="addTaskForm.sourceTopic" auto-complete="off" placeholder="请输入采集kafka主题"></el-input>
            </el-form-item>
            <div style="overflow:hidden;" key="taskSelectTable" v-if="addTaskForm.sourceType == 'database'">
                <el-col :span="18">
                    <el-form-item label="表名：" prop="selectTable">
                        <el-input v-model="addTaskForm.selectTable" auto-complete="off" placeholder="请输入表名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-button size="mini" style="margin-left:10px" @click="queryDbField('source')">查询数据库字段</el-button>
                </el-col>
            </div>
            <el-form-item label="数据库查询对应字段：" key="taskDbSelectField" v-if="addTaskForm.sourceType == 'database'">
                <el-select v-model="addTaskForm.dbSelectField" multiple placeholder="请选择数据库查询对应字段">
                    <el-option v-for="item in dbSelectFieldList" :key="item.index" :label="item.COLUMN_NAME" :value="item.COLUMN_NAME">
                        <span style="float: left">{{ item.COLUMN_NAME }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px;padding-right: 25px;">{{ item.COLUMN_COMMENT }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="数据库查询排序字段：" key="taskOrderFields" v-if="addTaskForm.sourceType == 'database'">
                <el-select v-model="addTaskForm.orderFields" multiple placeholder="请选择数据库查询排序字段">
                    <el-option v-for="item in dbSelectFieldList" :key="item.index" :label="item.COLUMN_NAME" :value="item.COLUMN_NAME">
                        <span style="float: left">{{ item.COLUMN_NAME }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px;padding-right: 25px;">{{ item.COLUMN_COMMENT }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文件路径：" key="taskFilePath" v-if="addTaskForm.sourceType == 'ftp' || addTaskForm.sourceType == 'staticFile'">
                <el-input v-model="addTaskForm.filePath" auto-complete="off" placeholder="请输入服务器文件路径"></el-input>
            </el-form-item>

            <el-form-item label="输出类型：" prop="destType">
                <el-select v-model="addTaskForm.destType" placeholder="请选择采集输出种类" @change="taskTypeChange('dest')">
                    <el-option label="kafka" value="kafka"></el-option>
                    <el-option label="数据库" value="database"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="输出源：" prop="destId" key="taskDestId" v-if="addTaskForm.destType && addTaskForm.destType !== 'staticFile'">
                <el-select v-model="addTaskForm.destId" placeholder="请选择输出源">
                    <el-option v-for="item in destIdList" :key="item.id" :label="item.datasourceName" :value="item.id">
                        <span style="float: left">名称: {{ item.datasourceName }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px;padding-right: 25px;">IP: {{ item.ip }}</span>
                        <!-- <span style="float: left">{{ item.outOrIn == 1 ? '输入' : (item.outOrIn == 0 ? '输出' : '') }}</span> -->
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="目标kafka主题：" prop="destTopic" key="taskDestTopic" v-if="addTaskForm.destType == 'kafka'">
                <el-input v-model="addTaskForm.destTopic" auto-complete="off" placeholder="请输入目标kafka主题"></el-input>
            </el-form-item>
            <div style="overflow:hidden;" key="taskInsertTable" v-if="addTaskForm.destType == 'database'">
                <el-col :span="18">
                    <el-form-item label="表名：" prop="insertTable">
                        <el-input v-model="addTaskForm.insertTable" auto-complete="off" placeholder="请输入表名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-button size="mini" style="margin-left:10px" @click="queryDbField('dest')">查询数据库字段</el-button>
                </el-col>
            </div>
            <el-form-item label="数据库插入对应字段：" key="taskDbInsertField" v-if="addTaskForm.destType == 'database'">
                <el-select v-model="addTaskForm.dbInsertField" multiple placeholder="请选择数据库插入对应字段">
                    <el-option v-for="item in dbInsertFieldList" :key="item.index" :label="item.COLUMN_NAME" :value="item.COLUMN_NAME">
                        <span style="float: left">{{ item.COLUMN_NAME }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px;padding-right: 25px;">{{ item.COLUMN_COMMENT }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="运行频率：">
                <el-select v-model="addTaskForm.scheduleSeclect" placeholder="请选择运行频率">
                    <el-option v-for="item in scheduleSeclectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option> 
                </el-select>
            </el-form-item>
            <el-form-item label="自定义频率：" key="scheduleCorn" v-if="addTaskForm.scheduleSeclect == 'scheduleCorn'">
                <el-input v-model="addTaskForm.scheduleCorn" auto-complete="off" placeholder="请输入自定义频率，格式：*/5 * * * * ?"></el-input>
                <el-tooltip class="item" effect="dark" content="时间表达式，例：每5分钟 0 */5 * * * ?" placement="right">
                    <i class="el-icon-question" style="position: absolute;right: -20px;top: 10px;"></i>
                </el-tooltip>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <button class="btn btn-blue" @click="saveAddEditTask()">保 存</button>
            <button class="btn" @click="cancleAddTask()">取 消</button>
        </div>
        </el-dialog>
        <!--新增任务弹框 end-->

        <!--删除 start-->
        <el-dialog :visible.sync="deleteDialog" width="25%" custom-class='deleteDialog' :before-close="cancleDelete">
            <h4>确定删除？</h4>
            <span slot="footer" class="dialog-footer">
				<button class="btn btn-blue" @click="confirmDelete()">确 定</button>
            <button class="btn" @click="cancleDelete()">取 消</button>
            </span>
        </el-dialog>
        <!--删除 end-->

        <!--启动 start-->
        <el-dialog :visible.sync="updateTaskStatusDialog" width="25%" custom-class='deleteDialog' :before-close="cancleUpdateStatus">
            <h4>{{selectedTaskStatus.runStatus == 1 ? '确定停止？' : '确定启动？'}}</h4>
            <span slot="footer" class="dialog-footer">
				<button class="btn btn-blue" @click="confirmUpdateStatus()">确 定</button>
            <button class="btn" @click="cancleUpdateStatus()">取 消</button>
            </span>
        </el-dialog>
        <!--启动 end-->
        <div v-loading.fullscreen.lock="fullscreenLoading" element-loading-background="rgba(0, 0, 0, 0)"></div>
    </div>
</template>

<script>
export default {
    inject: ['reload'],
    name: 'DataCollect',
    data () {
        return {
            serviceId: '', // 从社区平台跳转时传入的serviceId
            fullscreenLoading: false,
            currentType: '',
            sourceDialog: false, // 数据源新增弹框
            taskDialog: false, // 新增任务的弹框
            deleteDialog: false, // 确认删除的弹框
            updateTaskStatusDialog: false, // 确认启动/停止
            centralService: '', // 中心服务地址
            selectedTaskStatus: {},
            tableData: {
                sourceData: [],
                taskData: []
            },
            selectedList: [],
            deleteList: [],
            isSourceEdit: false,
            isTaskEdit: false,
            allSourceIdList: [],
            allDestIdList: [],
            sourceIdList: [],
            destIdList: [],
            CollectMappingList: [], // 采集数据类型
            CollectMappingObj: {},
            dbSelectFieldList: [],
            dbInsertFieldList: [],
            sourceTotalRow: 0,
            taskTotalRow: 0,
            taskTimer: '',
            sourcePage: { 
                pageSize: 10,
                currentPage: 1,
            },
            taskPage: { 
                pageSize: 10,
                currentPage: 1,
            },
            querySourceForm: {
                datasourceName: '',
                datasourceType: '',
                ip: '',
                outOrIn: ''
            },
            queryTaskForm: {
                taskName: '',
                sourceType: '',
                runStatus: ''
            },
            addSourceForm: {
                datasourceName: "",
                datasourceType: '',
                ftpForm: {
                    ip: '',
                    port: '',
                    userName: '',
                    password: '',
                    fileDirectory: '',
                    outOrIn: ''
                },
                kafkaForm: {
                    ip: '',
                    port: '',
                    outOrIn: '',
                    groupId: ''
                },
                dbForm: {
                    databaseType: '',
                    ip: '',
                    port: '',
                    databaseName: '',
                    userName: '',
                    password: '',
                    outOrIn: ''
                }
            },
            addTaskForm: {
                taskName: '', 
                dataTypeId: '',
                sourceType: '',
                sourceId: '',
                sourceTopic: '',
                dbSelectField: '',
                filePath: '',
                destType: '',
                destId: '',
                destTopic: '',
                dbInsertField: '',
                selectTable: '',
                insertTable: '',
                orderFields: '',
                scheduleCorn: '',
                scheduleSeclect: '',
                saveEditData:{
                    taskId: '',
                    runStatus: '',
                }
            },
            scheduleSeclectOptions: [
                {label: '每5秒运行一次', value: '*/5 * * * * ?'},
                {label: '每10秒运行一次', value: '*/10 * * * * ?'},
                {label: '每1分钟运行一次', value: '0 */1 * * * ?'},
                {label: '每5分钟运行一次', value: '0 */5 * * * ?'},
                {label: '自定义', value: 'scheduleCorn'}
            ],
            ipPortRules: {
                ip: [
                    { required: true, message: '请输入IP', trigger: 'blur' },
                ],
                port: [
                    { required: true, message: '请输入端口号', trigger: 'blur' }
                ],
                outOrIn: [
                    { required: true, message: '请选择输入输出', trigger: 'change' },
                    { validator: (rule, value, callback) => {
						if (value == 'null' || !value) {
							callback(new Error('请选择输入输出'));
						} else {
							callback();
						}
					}, trigger: 'change' }
                ]
            },
            addSourceRules: {
                datasourceName: [
                    { required: true, message: '请输入数据源名称', trigger: 'blur' },
                ],
                datasourceType: [
                    { required: true, message: '请选择数据源种类', trigger: 'change' }
                ]
            },
            addTaskRules: {
                taskName: [
                    { required: true, message: '请输入任务名称', trigger: 'blur' },
                ],
                sourceType: [
                    { required: true, message: '请选择来源类型', trigger: 'change' }
                ],
                destType: [
                    { required: true, message: '请选择输出类型', trigger: 'change' }
                ],
                sourceId: [
                    { required: true, message: '请选择数据来源', trigger: 'change' }
                ],
                destId: [
                    { required: true, message: '请选择输出源', trigger: 'change' }
                ],
                dataTypeId: [
                    { required: true, message: '请选择数据类型', trigger: 'change' }
                ],
                sourceTopic: [
                    { required: true, message: '请输入采集kafka主题', trigger: 'blur' }
                ],
                destTopic: [
                    { required: true, message: '请输入目标kafka主题', trigger: 'blur' }
                ],
                selectTable: [
                    { required: true, message: '请输入表名', trigger: 'blur' }
                ],
                insertTable: [
                    { required: true, message: '请输入表名', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
        var self = this;
        this.serviceId = this.$route.params.serviceId;
        this.currentType = 'DataSource';
        this._getSourceDataList();
        window.onresize = function(){
            clearInterval(this.taskTimer);
            self.reload();
        }
    },
    destroyed () {
        clearInterval(this.taskTimer);
    },
    methods: {
        getDataType(type) {
            var dataType = {
                'ftp' : 'FTP',
                'kafka': 'kafka',
                'database': '数据库',
                'staticFile': '文件',
            }
            return dataType[type] || ''
        },
        getMaxHeight() {
            return window.innerHeight - 300
        },
        sourceIndexMethod(index) {
            if ((this.sourcePage.currentPage-1)*this.sourcePage.pageSize >= this.sourceTotalRow) {
                this.sourcePage.currentPage = this.sourcePage.currentPage-1;
            }
            return (this.sourcePage.currentPage-1)*this.sourcePage.pageSize + index + 1;
        },
        taskIndexMethod(index) {
            if ((this.taskPage.currentPage-1)*this.taskPage.pageSize >= this.taskTotalRow) {
                this.taskPage.currentPage = this.taskPage.currentPage-1;
            }
            return (this.taskPage.currentPage-1)*this.taskPage.pageSize + index + 1;
        },
        // 采集/中心配置切换
        Switch(type) {
            var self = this;
            this.currentType = type;
            this.deleteList = [];
            this.selectedList = [];
            switch (type) {
                case 'DataSource': 
                    self._getSourceDataList();
                    clearInterval(self.taskTimer);
                    break;
                case 'ColleckConfig':
                    self._getTaskDataList();
                    self._getCollectMappingList();
                    self._getAllDataSourceList();
                    clearInterval(self.taskTimer);
                    self.taskTimer = setInterval(function(){
                        self._getTaskDataList('timer');
                    },50000000);
                    break;
                case 'CentralManage':
                    self._getSysParams();
                    clearInterval(self.taskTimer);
                    break;
            }
        },
        // 数据源新增
        sourceAddClick() {
            this.sourceDialog = true;
        },
        // 采集任务新增
        taskAddClick() {
            this.taskDialog = true;
        },
        // 表格复选框勾选
        sourceSelectionChange(val) {
            this.selectedList = val;
        },
        taskSelectionChange(val) {
            this.selectedList = val;
        },
        sourceTypeChange() {
            if (this.$refs['addSourceFormFtp'])  this.$refs['addSourceFormFtp'].resetFields();
            if (this.$refs['addSourceFormKafka'])  this.$refs['addSourceFormKafka'].resetFields();
            if (this.$refs['addSourceFormDb'])  this.$refs['addSourceFormDb'].resetFields();
        },
        taskTypeChange(type) {
            var self = this;
            var allData = [];
            var selectType = '';
            if (type === 'source') {
                this.sourceIdList = [];
                allData = this.allSourceIdList;
                selectType = this.addTaskForm.sourceType;
                // 清除表单数据
                this.addTaskForm.sourceId = '';
                this.addTaskForm.sourceTopic = '';
                this.addTaskForm.dbSelectField = '';
                this.addTaskForm.filePath = '';
                this.addTaskForm.selectTable = '';
                this.addTaskForm.orderFields = '';
            } else if (type === 'dest') {
                this.destIdList = [];
                this.addTaskForm.destId = '';
                allData = this.allDestIdList;
                selectType = this.addTaskForm.destType;
                // 清除表单数据
                this.addTaskForm.destId = '';
                this.addTaskForm.destTopic = '';
                this.addTaskForm.dbInsertField = '';
                this.addTaskForm.insertTable = '';
            }
            
            switch (selectType) {
                case 'ftp':
                    allData.forEach(function(item){
                        if (item.datasourceType === 'ftp'){
                            if (type === 'source') self.sourceIdList.push(item);
                            if (type === 'dest') self.destIdList.push(item);
                        }
                    })
                    break;
                case 'kafka':
                    allData.forEach(function(item){
                        if (item.datasourceType === 'kafka'){
                            if (type === 'source') self.sourceIdList.push(item);
                            if (type === 'dest') self.destIdList.push(item);
                        }
                    })
                    break;
                case 'database':
                    allData.forEach(function(item){
                        if (item.datasourceType === 'database'){
                            if (type === 'source') self.sourceIdList.push(item);
                            if (type === 'dest') self.destIdList.push(item);
                        }
                    })
                    break;
                case 'file':
                    
                    break;
            }
        },
        _getCollectMappingList() {
            var self = this;
             this.$http("collectAPI", "getCollectMappingList").then(resp=>{
                if(resp.data.code == 200){
                    self.CollectMappingList = resp.data.data;
                    self.CollectMappingList.forEach(function(item){
                        self.CollectMappingObj[item.dataTypeId] = item.dataTypeName;
                    });
                }else{
                    self.CollectMappingList = [];
                }
            }).catch(function(){
                self.CollectMappingList = [];
            }).finally(function() {
            });
        },
        _getSourceDataList() {
           // 获取表格数据sourceTableData
            this.querySourceData();
        },
        _getTaskDataList(type) {
            if (type === 'query' || type === 'add') {
                this.taskPage.currentPage = 1;
            }
            if (type !== 'timer'){
                this.fullscreenLoading = true;
            }
            var self = this;
            // 获取表格数据taskTableData
            var req = {
                pageNumber: this.taskPage.currentPage,
                pageSize: this.taskPage.pageSize,
                taskName: this.queryTaskForm.taskName,
                sourceType: this.queryTaskForm.sourceType,
                runStatus: this.queryTaskForm.runStatus
            };
            
            this.$http("collectAPI", "getCollectTaskListByParam", req).then(resp=>{
                if(resp.data.code == 200){
                    if (type == 'timer') {
                        self.tableData.taskData.forEach(function(item){
                            resp.data.data.list.forEach(function(j){
                                if (item.taskId === j.taskId){
                                    item.throughput = j.throughput;
                                    item.amount = j.amount;
                                }
                            })
                        })
                    }else{
                        self.tableData.taskData = resp.data.data.list;
                        self.taskTotalRow = resp.data.data.totalRow;
                    }
                    
                    if (type === 'query') {
                        self.$message({
                            message: '查询成功',
                            type: 'success'
                        });
                    }
                }else{
                    self.tableData.taskData = [];
                    self.taskTotalRow = 0;
                    self.$message({
                        message: resp.data.message,
                        type: 'error'
                    });
                }
            }).catch(function(){
                self.tableData.taskData = [];
                self.taskTotalRow = 0;
                self.$message({
                    message: '获取采集任务列表失败',
                    type: 'error'
                });
            }).finally(function() {
                if (type !== 'timer'){
                    self.fullscreenLoading = false;
                }
			});
        },
        querySourceData(type) {
            if (type === 'query' || type === 'add') {
                this.sourcePage.currentPage = 1;
            }
            this.fullscreenLoading = true;
            var self = this;
            //todo:
            // var req = '?pageNumber='+ this.sourcePage.currentPage +'&pageSize=' + this.sourcePage.pageSize + (!!this.serviceId?'&serviceId='+this.serviceId:'');
            // for (var key in this.querySourceForm) {
            //     if(this.querySourceForm[key] && !req){
            //         req += '?' + key + '=' + this.querySourceForm[key];
            //     } else if (this.querySourceForm[key] && req) {
            //         req += '&' + key + '=' + this.querySourceForm[key];
            //     }
            // }
            this.$http("collectAPI", "getDataSourceListByParam", this.querySourceForm).then(resp=>{
                if(resp.data.code == 200){
                    self.tableData.sourceData = resp.data.data.list;
                    self.sourceTotalRow = resp.data.data.totalRow;
                    if (type === 'query') {
                        self.$message({
                            message: '查询成功',
                            type: 'success'
                        });
                    }
                }else{
                    self.tableData.sourceData = [];
                    self.sourceTotalRow = 0;
                    self.$message({
                        message: resp.data.message,
                        type: 'error'
                    });
                }
            }).catch(function(){
                self.tableData.sourceData = [];
                self.sourceTotalRow = 0;
                self.$message({
                    message: '获取数据源列表失败',
                    type: 'error'
                });
            }).finally(function() {
                self.fullscreenLoading = false;
                self.serviceId = '';
			});
        },
        // 打开删除确认弹框
        openDeleteDialog(item) {
            var self = this;
            if (item) {
                // 删除单条
                this.deleteList = [];
                this.deleteList.push(item.id || item.taskId);
                this.deleteDialog = true;
            }else {
                // 多选删除
                this.deleteList = [];
                this.selectedList.forEach(function(item){
                    self.deleteList.push(item.id || item.taskId);
                })
                if (this.deleteList.length === 0) {
                    this.$message({
                        message: '请先勾选需要删除的数据',
                        type: 'error'
                    });
                    return
                }
                this.deleteDialog = true;
            }
        },
        // 删除的方法
        _deleteItem(dataList) {
            var self = this;
            this.fullscreenLoading = true;
            if (this.currentType === 'DataSource') {
                //todo:
                // let req = '?ids=' + dataList.join(',');
                var request = {
                    ids:dataList.join(',')
                    };
                this.$http("collectAPI", "deleteDataSource", request).then(resp=>{
                    if(resp.data.code == 200){
                        // 刷新列表
                        self._getSourceDataList();
                        self.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    }else{
                        self.$message({
                            message: resp.data.message,
                            type: 'error'
                        });
                    }
                }).catch(function(){
                    self.$message({
                        message: '删除数据源失败',
                        type: 'error'
                    });
                }).finally(function() {
                    self.fullscreenLoading = false;
                });
            } else if (this.currentType === 'ColleckConfig') {
                  //todo:
                  // let req = '?taskIds=' + dataList.join(',');
                  let request={
                      taskIds: dataList.join(',')
                  };
                  this.$http("collectAPI", "deleteCollectTask", request).then(resp=>{
                    if(resp.data.code == 200){
                        // 刷新列表
                        self._getTaskDataList();
                        self.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    }else{
                        self.$message({
                            message: resp.data.message,
                            type: 'error'
                        });
                    }
                }).catch(function(){
                    self.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                }).finally(function() {
                    self.fullscreenLoading = false;
                });
            }
        },
        // 保存新增或修改
        saveAddEditSource() {
        this.$refs['addSourceForm'].validate((valid) => {
            if (valid) {
                switch (this.addSourceForm.datasourceType) {
                    case 'ftp': 
                        this.$refs['addSourceFormFtp'].validate((valid2) => {
                            if (valid2) {
                                this._addOrUpdateSource();
                            }else {
                                return false;
                            }
                        })
                        break;
                    case 'kafka':
                        this.$refs['addSourceFormKafka'].validate((valid2) => {
                            if (valid2) {
                                this._addOrUpdateSource();
                            }else {
                                return false;
                            }
                        })
                        break;
                    case 'database': 
                        this.$refs['addSourceFormDb'].validate((valid2) => {
                            if (valid2) {
                                this._addOrUpdateSource();
                            }else {
                                return false;
                            }
                        })
                        break;
                }
            } else {
                return false;
            }
            });
        },
        // 调用新增、更新的接口
        _addOrUpdateSource(){
            var self = this;
            this.fullscreenLoading = true;
            var req = {
                datasourceName: this.addSourceForm.datasourceName,
                datasourceType: this.addSourceForm.datasourceType
            }
            switch (this.addSourceForm.datasourceType) {
                case 'ftp': 
                    req = Object.assign(req, this.addSourceForm.ftpForm);
                    break;
                case 'kafka':
                    req = Object.assign(req, this.addSourceForm.kafkaForm);
                    break;
                case 'database': 
                    req = Object.assign(req, this.addSourceForm.dbForm);
                    break;
            }
            var requestName = 'addDataSource';
            var messageText = '新增';
            if (this.isSourceEdit) {
                req.id = this.addSourceForm.id;
                requestName = 'updateDataSource';
                messageText = '修改';
            }
           this.$http("collectAPI", requestName, req).then(resp=>{
                self.cancleAddSource();
                if (messageText === '修改') {
                    self.querySourceData();
                }else{
                    self.querySourceData('add');
                }
                if(resp.data.code == 200){
                    self.$message({
                        message: messageText+'成功',
                        type: 'success'
                    });
                }else{
                    self.$message({
                        message: resp.data.message,
                        type: 'error'
                    });
                }
            }).catch(function(){
                self.$message({
                    message: messageText+'失败',
                    type: 'error'
                });
            }).finally(function() {
                self.fullscreenLoading = false;
            });
        },
        saveAddEditTask() {
            var self = this;
            this.$refs['addTaskForm'].validate((valid) => {
            if (valid) {
                var req = {};
                req = Object.assign(req,this.addTaskForm);
                if (req.dbSelectField instanceof Array) req.dbSelectField = req.dbSelectField.join(',');
                if (req.dbInsertField instanceof Array) req.dbInsertField = req.dbInsertField.join(',');
                if (req.orderFields instanceof Array) req.orderFields = req.orderFields.join(',');
                if (req.scheduleSeclect && req.scheduleSeclect != 'scheduleCorn') {
                    req.scheduleCorn = req.scheduleSeclect;
                }

                var requestName = 'addCollectTask';
                var messageText = '新增';
                if (this.isTaskEdit) {
                    req.taskId = this.addTaskForm.saveEditData.taskId;
                    req.runStatus = this.addTaskForm.saveEditData.runStatus;
                    requestName = 'updateCollectTask';
                    messageText = '修改';
                }
                self.fullscreenLoading = true;
                this.$http("collectAPI", requestName, req).then(resp=>{
                    self.cancleAddTask();
                    if (messageText === '修改') {
                        self._getTaskDataList();
                    }else{
                        self._getTaskDataList('add');
                    }
                    if(resp.data.code == 200){
                        self.$message({
                            message: messageText+'成功',
                            type: 'success'
                        });
                    }else{
                        self.$message({
                            message: resp.data.message,
                            type: 'error'
                        });
                    }
                }).catch(function(){
                    self.$message({
                        message: messageText+'失败',
                        type: 'error'
                    });
                }).finally(function() {
                    self.fullscreenLoading = false;
                });
            } else {
                return false;
            }
            });
        },
        // 取消新增
        cancleAddSource() {
            this.sourceDialog = false;
        },
        clearSourceData() {
            this.$refs['addSourceForm'].resetFields();
            this.isSourceEdit = false;
            for (let i in this.addSourceForm) {
                if (this.addSourceForm[i] instanceof Object) {
                    for (let j in this.addSourceForm[i]) {
                        this.addSourceForm[i][j] = '';
                    }
                }else{
                    this.addSourceForm[i] = '';
                }
            }
        },
        cancleAddTask() {
            this.taskDialog = false;
        },
        clearTaskData() {
            this.$refs['addTaskForm'].resetFields();
            this.isTaskEdit = false;
            for (let i in this.addTaskForm) {
                if (this.addTaskForm[i] instanceof Object) {
                    for (let j in this.addTaskForm[i]) {
                        this.addTaskForm[i][j] = '';
                    }
                }else{
                    this.addTaskForm[i] = '';
                }
            }
        },
        // 确定删除
        confirmDelete() {
            // 删除
            this._deleteItem(this.deleteList);
            this.deleteDialog = false;
        },
        // 取消删除
        cancleDelete() {
            this.deleteDialog = false;
        },
        // 编辑
        sourceEdit(item) {
            this.isSourceEdit = true;
            this.addSourceForm.datasourceName = item.datasourceName;
            this.addSourceForm.datasourceType = item.datasourceType;
            this.addSourceForm.id = item.id;
            switch (item.datasourceType) {
                case 'ftp': 
                    for (let i in this.addSourceForm.ftpForm) {
                        this.addSourceForm.ftpForm[i] = item[i];
                    }
                    this.addSourceForm.ftpForm.outOrIn = this.addSourceForm.ftpForm.outOrIn+'';
                    break;
                case 'kafka':
                    for (let i in this.addSourceForm.kafkaForm) {
                        this.addSourceForm.kafkaForm[i] = item[i];
                    }
                    this.addSourceForm.kafkaForm.outOrIn = this.addSourceForm.kafkaForm.outOrIn+'';
                    break;
                case 'database': 
                    for (let i in this.addSourceForm.dbForm) {
                        this.addSourceForm.dbForm[i] = item[i];
                    }
                    this.addSourceForm.dbForm.outOrIn = this.addSourceForm.dbForm.outOrIn+'';
                    break;
            }
            this.sourceDialog = true;
        },
        taskEdit(item) {
            this.isTaskEdit = true;
            this.addTaskForm.saveEditData.taskId = item.taskId;
            this.addTaskForm.saveEditData.runStatus = item.runStatus;
            this.addTaskForm.taskName = item.taskName;
            this.addTaskForm.dataTypeId = item.dataTypeId;
            this.addTaskForm.sourceType = item.sourceType;
            this.addTaskForm.sourceId = item.sourceId;
            this.addTaskForm.sourceTopic = item.sourceTopic;
            this.addTaskForm.dbSelectField = (item.dbSelectField && item.dbSelectField.length) > 0 ? item.dbSelectField.split(',') : item.dbSelectField;
            this.addTaskForm.filePath = item.filePath;
            this.addTaskForm.destType = item.destType;
            this.addTaskForm.destId = item.destId;
            this.addTaskForm.destTopic = item.destTopic;
            this.addTaskForm.dbInsertField = item.dbInsertField;
            this.addTaskForm.insertTable = item.insertTable;
            this.addTaskForm.selectTable = item.selectTable;
            this.addTaskForm.orderFields = (item.orderFields && item.orderFields.length) > 0 ? item.orderFields.split(',') : item.orderFields;
            var isInOptions = false;
            this.scheduleSeclectOptions.forEach(function(i){
                if (i.value === item.scheduleCorn) {
                    isInOptions = true;
                }
            })
            if (isInOptions) {
                this.addTaskForm.scheduleCorn = '';
                this.addTaskForm.scheduleSeclect = item.scheduleCorn;
            }else {
                this.addTaskForm.scheduleCorn = item.scheduleCorn;
                this.addTaskForm.scheduleSeclect = 'scheduleCorn';
            }

            var self = this;
            self.sourceIdList = [];
            switch (this.addTaskForm.sourceType) {
                case 'ftp':
                    this.allSourceIdList.forEach(function(item){
                        if (item.datasourceType === 'ftp'){
                            self.sourceIdList.push(item);
                        }
                    })
                    break;
                case 'kafka':
                    this.allSourceIdList.forEach(function(item){
                        if (item.datasourceType === 'kafka'){
                            self.sourceIdList.push(item);
                        }
                    })
                    break;
                case 'database':
                    this.allSourceIdList.forEach(function(item){
                        if (item.datasourceType === 'database'){
                            self.sourceIdList.push(item);
                        }
                    })
                    break;
            }
            self.destIdList = [];
            switch (this.addTaskForm.destType) {
                case 'ftp':
                    this.allDestIdList.forEach(function(item){
                        if (item.datasourceType === 'ftp'){
                            self.destIdList.push(item);
                        }
                    })
                    break;
                case 'kafka':
                    this.allDestIdList.forEach(function(item){
                        if (item.datasourceType === 'kafka'){
                            self.destIdList.push(item);
                        }
                    })
                    break;
                case 'database':
                    this.allDestIdList.forEach(function(item){
                        if (item.datasourceType === 'database'){
                            self.destIdList.push(item);
                        }
                    })
                    break;
            }
            this.taskDialog = true;
        },
        _getAllDataSourceList() {
            var self = this;
            // var req = '?pageNumber=1&pageSize=99999';
            let req={
                pageNumber:1,
                pageSize:99999
            };
            this.allSourceIdList = [];
            this.allDestIdList = [];
            this.$http("collectAPI", "getDataSourceListByParam", req).then(resp=>{
                if(resp.data.code == 200){
                    var allDataSourceList = resp.data.data.list;
                    allDataSourceList.forEach(function(item){
                        if (item.outOrIn !== 0){
                            self.allSourceIdList.push(item);
                        }
                        if (item.outOrIn !== 1){
                            self.allDestIdList.push(item);
                        }
                    })
                }
            },()=>{}).catch(function(){

            }).finally(function() {});
        },
        queryDbField(type) {
            var self = this;
            var req = {
                dbId: '',
                tableName: '',
            }
            if (type === 'source') {
                if (!this.addTaskForm.sourceId || !this.addTaskForm.selectTable) {
                    this.$message({
                        message: '数据来源和表名不能为空',
                        type: 'error'
                    });
                    return;
                }
                req.dbId = this.addTaskForm.sourceId;
                req.tableName = this.addTaskForm.selectTable;
                this.dbSelectFieldList = [];
            } else if (type === 'dest') {
                if (!this.addTaskForm.destId || !this.addTaskForm.insertTable) {
                    this.$message({
                        message: '输出源和表名不能为空',
                        type: 'error'
                    });
                    return;
                }
                req.dbId = this.addTaskForm.destId;
                req.tableName = this.addTaskForm.insertTable;
                this.dbInsertFieldList = [];
            }
            // var querystring = require('querystring');
            this.$http("collectAPI", "getDynamicDbColumn", req).then(resp=>{
                if(resp.data.code == 200){
                    if (type === 'source') self.dbSelectFieldList = resp.data.data;
                    if (type === 'dest') self.dbInsertFieldList = resp.data.data;
                    self.$message({
                        message: '查询成功',
                        type: 'success'
                    });
                }else{
                    self.$message({
                        message: resp.data.message,
                        type: 'error'
                    });
                }
            }).catch(function(){
                self.$message({
                    message: '查询失败',
                    type: 'error'
                });
            }).finally(function() {});
        },
        // 启动或暂停
        startOrStop(item) {
            this.selectedTaskStatus.taskId = item.taskId;
            this.selectedTaskStatus.runStatus = item.runStatus;
            this.updateTaskStatusDialog = true;
        },
        confirmUpdateStatus() {
            var self = this;
            this.fullscreenLoading = true;
            var req = {
                taskId: this.selectedTaskStatus.taskId,
                runStatus: this.selectedTaskStatus.runStatus == 1 ? 0 : 1, 
			}
            this.$http("collectAPI", "updateCollectTaskRunStatus", req).then(resp=>{
                if(resp.data.code == 200){
                    self.$message({
                        message: self.selectedTaskStatus.runStatus == 1 ? '停止成功' : '启动成功',
                        type: 'success'
                    });
                }else{
                    self.$message({
                        message: resp.data.message,
                        type: 'error'
                    });
                }
            }).catch(function(){
                self.$message({
                    message: self.selectedTaskStatus.runStatus == 1 ? '停止失败' : '启动失败',
                    type: 'error'
                });
            }).finally(function() {
                self.updateTaskStatusDialog = false;
                self.fullscreenLoading = false;
                self._getTaskDataList();
			});
        },
        cancleUpdateStatus() {
            this.updateTaskStatusDialog = false;
        },
        _getSysParams() {
            var self = this;
            this.$http("collectAPI", "getSysParams").then(resp=>{
                if(resp.data.code == 200){
                    resp.data.data.forEach(function(item){
                        if (item.key === 'centralServiceIp'){
                            self.centralService = item.value;
                        }
                    })
                }else{
                    self.$message({
                        message: resp.data.message,
                        type: 'error'
                    });
                }
            }).catch(function(){
                self.$message({
                    message: '获取中心服务地址失败',
                    type: 'error'
                });
            }).finally(function() {});
        },
        // 修改中心服务地址
        modifyCentralService() {
            var self = this;
            var req = {
                key: 'centralServiceIp',
                value: this.centralService
            }
            this.fullscreenLoading = true;
            this.$http("collectAPI", "updateSysParams", req).then(resp=>{
                if(resp.data.code == 200){
                    self.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                }else{
                    self.$message({
                        message: resp.data.message,
                        type: 'error'
                    });
                }
            }).catch(function(){
                self.$message({
                    message: '修改失败',
                    type: 'error'
                });
            }).finally(function() {
                self.fullscreenLoading = false;
			});
        },
        // 清除中心服务地址
        clearCentralService() {
            this.centralService = '';
        },
        sourceHandleSizeChange(val) {
            this.sourcePage.pageSize = val;
            this._getSourceDataList();
        },
        sourceHandleCurrentChange(val) {
            this.sourcePage.currentPage = val;
            this._getSourceDataList();
        },
        taskHandleSizeChange(val) {
            this.taskPage.pageSize = val;
            this._getTaskDataList();
        },
        taskHandleCurrentChange(val) {
            this.taskPage.currentPage = val;
            this._getTaskDataList();
        },
        goToDataMapping(){
            this.$router.push({path:'/DataMapping'});
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.collectContent{
    height: 100%;
}
.tableheader th{
    background-color: #f8f8f8!important;
}
.tableheader th>.cell{
    text-align: center;
}
.btn{
    min-width:80px;
    margin-right: 5px;
}
.btn:hover, .btn:focus, .btn.focus{
	color:#fff;
	opacity:0.8;
}
.btn-blue{
	background:#1c80ec;
	color:#fff;
}
.btn-red{
	background:#ff606c;
	color:#fff;
}
.colorRed{
	color:#ff3d3d!important;
}
.colorGreen{
	color:#01c35a!important;
}
.table-icon{
	display:inline-block;
	vertical-align:middle;
	cursor:pointer;
	width:20px;
	height:20px;
	background:url(../assets/img/table_icon.png) no-repeat;
}
.table-icon:hover{
	outline: 0;
    text-decoration: none;
    -webkit-transition: all .2s ease-in-out;
    -moz-transition: all .2s ease-in-out;
    -o-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out;
    -ms-transition: all .2s ease-in-out;
}
.table-icon.icon-operation{
	background-position:0 0;
}
.table-icon.icon-operation:hover{
	background-position:0 -20px;
}
.table-icon.icon-pause{
	background-position:-20px 0;
}
.table-icon.icon-pause:hover{
	background-position:-20px -20px;
}
.table-icon.icon-editor{
	background-position:-40px 0;
}
.table-icon.icon-editor:hover{
	background-position:-40px -20px;
}
.table-icon.icon-delect{
	background-position:-60px 0;
}
.table-icon.icon-delect:hover{
	background-position:-60px -20px;
}
.required-text{
	color:#ff0000!important;
	margin-right:4px;
}
.mainContent{
	width:100%;
	height:100%;
	/* padding-top:60px;
	position:relative; */
}
.mainContent .side{
	position:absolute;
	width:220px;
	background:#fff;
	top:60px;
	left:0;
	bottom:0;
	box-shadow:0 2px 5px rgba(0,0,0,0.3);
}
.mainContent .side .side-nav-menu{
	text-align:center;
	padding:30px 0;
	border-bottom:#e1e1e1 solid 1px;
	cursor:pointer;
}
.mainContent .side .side-nav-menu.mappingSpecial{
    padding:20px 0;
	border-bottom:#f5f5f5 solid 1px;
}
.mainContent .side .side-nav-menu.mapping{
	padding:10px 0;
}
.mainContent .side .side-nav-menu:last-child{
	border:none;
}
.mainContent .side .side-nav-menu .menu-icon{
	display:block;
	width:96px;
	height:96px;
	margin:0 auto 10px;
	background:url(../assets/img/menu_icon.png) no-repeat;
}
.mainContent .side .manage-menu .menu-icon{
	background-position:-103px 0;
}
.mainContent .side .source-menu .menu-icon{
	background-position:-206px 0;
}
.mainContent .side .side-nav-menu .menu-text{
	display:block;
	text-align:center;
}
.mainContent .side .side-nav-menu:hover .menu-text,
.mainContent .side .side-nav-menu.active .menu-text{
	color:#1c80ec;
}
.mainContent .side .task-menu:hover .menu-icon,
.mainContent .side .task-menu.active .menu-icon{
	background-position:0 -106px;
}
.mainContent .side .manage-menu:hover .menu-icon,
.mainContent .side .manage-menu.active .menu-icon{
	background-position:-103px -106px;
}
.mainContent .side .source-menu:hover .menu-icon,
.mainContent .side .source-menu.active .menu-icon{
	background-position:-206px -106px;
}
.mainContent .body-main{
    position:relative;
    height: 100%;
    margin-left: 220px;
	background:#fff;
	/* margin:10px 10px 10px 230px; */
 
	/* height:calc(100% - 20px); */
	box-shadow:0 0 10px rgba(0,0,0,0.2);
	
}
.mainContent .body-main .h5-title{
	font-size:16px;
	color:#666;
	padding:0 16px;
	line-height:45px;
	margin:0;
	border-bottom:#e1e1e1 solid 1px;
    text-align: left;
}
.mainContent .body-main .btn-box{
	padding:15px 15px 0 15px;
    text-align: left;
}
.mainContent .body-main .btn-box label{
    padding: 0;
}
.mainContent .body-main .btn-box .el-input,
.mainContent .body-main .btn-box .el-select{
    margin-right: 15px;
}
.mainContent .body-main .btn-box .btn{
	margin-right:10px;
}
.mainContent .body-main .table-box{
	padding:0 15px;
    height: calc(100% - 220px);
    max-height: 495px;
}
.mainContent .body-main .table-box .red{
    color:#ff3d3d!important;
}
.mainContent .body-main .table-box .green{
    color:#01c35a!important;
}
.mainContent .body-main .table-box th{
    text-align: center;
}
/*中心管理配置 css start*/
.mainContent .body-main .service-address{
	position:absolute;
	top:50%;
	left:50%;
	-webkit-transform:translate(-50%,-50%);
	-ms-transform:translate(-50%,-50%);
	transform:translate(-50%,-50%);
	background:#eff5fc;
	padding:40px 90px;
	text-align:center;
	box-shadow:0 0 10px rgba(0,0,0,0.1);
}
.mainContent .service-address .head-text{
	font-size:24px;
	color:#666;
}
.mainContent .service-address .input-box{
	position:relative;
	margin:30px 0 40px;
}
.mainContent .service-address .input-box input{
	width:480px;
	height:70px;
	font-size:24px;
	padding-right:60px;
	text-align:center;
	box-shadow:0 2px 5px rgba(0,0,0,0.2);
}
.mainContent .service-address .input-box .delect-icon{
	position: absolute;
    width: 24px;
    height: 24px;
    background: #dcdcdc;
    border-radius: 50%;
    top: 50%;
    margin-top: -12px;
    right: 34px;
    font-size: 20px;
    font-weight: bold;
    line-height: 23px;
    color: #fff;
    cursor:pointer;
}
.mainContent .body-main .service-address .btn-blue{
	width:130px;
	height:50px;
	font-size:20px;
}
/*中心管理配置 css end*/
.addDialog .el-dialog__header{
    text-align: left;
    border-bottom: 1px solid #eee;
}
.addDialog .el-dialog__body {
    text-align: left;
    padding-right: 60px;
}
.addDialog .el-dialog__footer{
    text-align: center;
}
.addDialog .el-select{
    width: 100%;
}
.deleteDialog .el-dialog__footer{
    text-align: center;
}
</style>
