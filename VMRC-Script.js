importPackage(java.lang);
importPackage(java.util);
importPackage(com.cloupia.service.cIM.inframgr);
importPackage(com.cloupia.service.cIM.inframgr.reservation);

var LOCKNAME = "Lock-Enable-VMRC";
var RES_TYPE = "VM_VMRC_Console";


var vms = input.vmId;
var vmIds = vms.split(",");
var action = input.action;

/*
try{
	for(var i=0; i<vmIds.length; i++){
		performAction(parseInt(vmIds[i]), action);
	}
}catch(e){
	logger.addError("Error occured"+e);
	ctxt.setFailed("Task failed to retrieve vm info.");
	ctxt.exit();
}
*/

function performAction(vmId, action){
	var result = false;
	logger.addInfo("Getting Info. for VM : "+vmId);
	var vmSummary = ctxt.getAPI().getVMwareVMInfo(vmId);

	if(vmSummary != null){
	
		if(action.equalsIgnoreCase("Enable")){
			if(vmSummary.isVmrcEnabled()){
				logger.addWarning("VMRC Console Access already enabled for this VM");
				return;
			}else{
				vmSummary.setVmrcEnabled(true);
				result = InfraPersistenceUtil.modifyVMWareVMSummary(vmSummary);
				if(result)
					logger.addInfo("VMRC Console Access Enabled successfully.");
				else
					logger.addWarning("failed to enable VMRC Console Access.");
			}
		}else{
			if(! vmSummary.isVmrcEnabled()){
				logger.addWarning("VMRC Console Access already disabled for this VM");
				return;
			}else{
				vmSummary.setVmrcEnabled(false);
				result = InfraPersistenceUtil.modifyVMWareVMSummary(vmSummary);
				if(result)
					logger.addInfo("VMRC Console Access Disabled successfully.");
				else
					logger.addWarning("failed to disable VMRC Console Access.");
			}
		}
	}else{
		logger.addWarning("VM not found :"+ vmSummary.getName());
	}
}


try
{
       CriticalSectionUtil.enterCriticalSection(ctxt, logger, LOCKNAME);
       //var resList = CapacityReservationPersistentUtil.getCapacityReservationByTypeAndGroup(RES_TYPE, 0);
       
        for(var i=0; i<vmIds.length; i++){
		performAction(parseInt(vmIds[i]), action);
	    }
}           catch(e){
	            logger.addError("Error occured"+e);
	            ctxt.setFailed("Task failed to retrieve vm info.");
	            ctxt.exit();
	
       //var newId = CapacityReservationPersistentUtil.addCapacityReservation(entry);
   
} finally 
{
     CriticalSectionUtil.exitCriticalSection(ctxt, logger);
}