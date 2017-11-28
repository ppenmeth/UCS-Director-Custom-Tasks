{\rtf1\ansi\ansicpg1252\cocoartf1404\cocoasubrtf470
{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
\paperw11900\paperh16840\margl1440\margr1440\vieww10800\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 importPackage(java.lang);\
importPackage(java.util);\
importPackage(com.cloupia.service.cIM.inframgr);\
importPackage(com.cloupia.service.cIM.inframgr.reservation);\
\
var LOCKNAME = "Lock-Enable-VMRC";\
var RES_TYPE = "VM_VMRC_Console";\
\
\
var vms = input.vmId;\
var vmIds = vms.split(",");\
var action = input.action;\
\
/*\
try\{\
	for(var i=0; i<vmIds.length; i++)\{\
		performAction(parseInt(vmIds[i]), action);\
	\}\
\}catch(e)\{\
	logger.addError("Error occured"+e);\
	ctxt.setFailed("Task failed to retrieve vm info.");\
	ctxt.exit();\
\}\
*/\
\
function performAction(vmId, action)\{\
	var result = false;\
	logger.addInfo("Getting Info. for VM : "+vmId);\
	var vmSummary = ctxt.getAPI().getVMwareVMInfo(vmId);\
\
	if(vmSummary != null)\{\
	\
		if(action.equalsIgnoreCase("Enable"))\{\
			if(vmSummary.isVmrcEnabled())\{\
				logger.addWarning("VMRC Console Access already enabled for this VM");\
				return;\
			\}else\{\
				vmSummary.setVmrcEnabled(true);\
				result = InfraPersistenceUtil.modifyVMWareVMSummary(vmSummary);\
				if(result)\
					logger.addInfo("VMRC Console Access Enabled successfully.");\
				else\
					logger.addWarning("failed to enable VMRC Console Access.");\
			\}\
		\}else\{\
			if(! vmSummary.isVmrcEnabled())\{\
				logger.addWarning("VMRC Console Access already disabled for this VM");\
				return;\
			\}else\{\
				vmSummary.setVmrcEnabled(false);\
				result = InfraPersistenceUtil.modifyVMWareVMSummary(vmSummary);\
				if(result)\
					logger.addInfo("VMRC Console Access Disabled successfully.");\
				else\
					logger.addWarning("failed to disable VMRC Console Access.");\
			\}\
		\}\
	\}else\{\
		logger.addWarning("VM not found :"+ vmSummary.getName());\
	\}\
\}\
\
\
try\
\{\
       CriticalSectionUtil.enterCriticalSection(ctxt, logger, LOCKNAME);\
       //var resList = CapacityReservationPersistentUtil.getCapacityReservationByTypeAndGroup(RES_TYPE, 0);\
       \
        for(var i=0; i<vmIds.length; i++)\{\
		performAction(parseInt(vmIds[i]), action);\
	    \}\
\}           catch(e)\{\
	            logger.addError("Error occured"+e);\
	            ctxt.setFailed("Task failed to retrieve vm info.");\
	            ctxt.exit();\
	\
       //var newId = CapacityReservationPersistentUtil.addCapacityReservation(entry);\
   \
\} finally \
\{\
     CriticalSectionUtil.exitCriticalSection(ctxt, logger);\
\}}