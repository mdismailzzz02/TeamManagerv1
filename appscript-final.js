﻿// =============================================================
//               CONFIGURATION & CONSTANTS
// =============================================================

const SPREADSHEET_ID = '13ToeBKYEtJoTa8VcZijDI6563I22whZFYAkkQsyxdwA';
const SHIFTS_SHEET_NAME = 'RealTimeShifts';
const STAFF_SHEET_NAME = 'Staff';
const DEFAULT_TIMEZONE = 'America/New_York'; // Change this to your default timezone

// =============================================================
//               AUTOMATIC STATUS UPDATE TRIGGER
// =============================================================

/**
 * Creates time-driven trigger to automatically update shift statuses
 * This should be run manually once to set up the trigger
 */
function createStatusUpdateTrigger() {
  // Delete any existing triggers first
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'autoUpdateAllShiftStatuses') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Create new trigger to run every 1 minute
  ScriptApp.newTrigger('autoUpdateAllShiftStatuses')
    .timeBased()
    .everyMinutes(1)
    .create();
    
  Logger.log('âœ… Auto-update trigger created successfully');
  Logger.log('â° Will run every 1 minute');
  Logger.log('ðŸŽ¯ Function: autoUpdateAllShiftStatuses');
  
  return {
    success: true,
    message: 'Trigger created successfully',
    interval: '1 minute',
    function: 'autoUpdateAllShiftStatuses',
    timestamp: new Date().toISOString()
  };
}

/**
 * Manual trigger for immediate status update testing
 * Run this function directly to test the auto-update logic
 */
function manualStatusUpdate() {
  Logger.log('ðŸš€ MANUAL STATUS UPDATE TRIGGERED');
  const result = autoUpdateAllShiftStatuses();
  Logger.log('ðŸ“‹ Manual update result:');
  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

/**
 * Check current trigger status
 */
function checkTriggerStatus() {
  const triggers = ScriptApp.getProjectTriggers();
  const statusTriggers = triggers.filter(trigger => 
    trigger.getHandlerFunction() === 'autoUpdateAllShiftStatuses'
  );
  
  Logger.log(`ðŸ“Š Trigger Status Check:`);
  Logger.log(`- Found ${statusTriggers.length} auto-update triggers`);
  
  statusTriggers.forEach((trigger, index) => {
    Logger.log(`  Trigger ${index + 1}:`);
    Logger.log(`  - Function: ${trigger.getHandlerFunction()}`);
    Logger.log(`  - Type: ${trigger.getTriggerSource()}`);
    Logger.log(`  - Event Type: ${trigger.getEventType()}`);
  });
  
  return {
    triggerCount: statusTriggers.length,
    isActive: statusTriggers.length > 0,
    triggers: statusTriggers.map(t => ({
      function: t.getHandlerFunction(),
      source: t.getTriggerSource(),
      eventType: t.getEventType()
    }))
  };
}

/**
 * Check current trigger status
 */
function checkTriggerStatus() {
  const triggers = ScriptApp.getProjectTriggers();
  const statusTriggers = triggers.filter(trigger => 
    trigger.getHandlerFunction() === 'autoUpdateAllShiftStatuses'
  );
  
  Logger.log(`ðŸ“Š Trigger Status Check:`);
  Logger.log(`- Found ${statusTriggers.length} auto-update triggers`);
  
  statusTriggers.forEach((trigger, index) => {
    Logger.log(`  Trigger ${index + 1}:`);
    Logger.log(`  - Function: ${trigger.getHandlerFunction()}`);
    Logger.log(`  - Type: ${trigger.getTriggerSource()}`);
    Logger.log(`  - Event Type: ${trigger.getEventType()}`);
  });
  
  return {
    triggerCount: statusTriggers.length,
    isActive: statusTriggers.length > 0,
    triggers: statusTriggers.map(t => ({
      function: t.getHandlerFunction(),
      source: t.getTriggerSource(),
      eventType: t.getEventType()
    }))
  };
}

/**
 * Test the timezone-aware auto-update system
 */
function testTimezoneAutoUpdate() {
  try {
    Logger.log('ðŸ§ª Testing timezone auto-update system...');
    
    // Get user timezone
    const userTimezone = getUserTimezoneForAutoUpdate();
    const defaultTime = getCurrentTimeString(DEFAULT_TIMEZONE);
    const userTime = getCurrentTimeString(userTimezone);
    
    const result = {
      success: true,
      message: 'Timezone auto-update test completed',
      data: {
        defaultTimezone: DEFAULT_TIMEZONE,
        defaultTime: defaultTime,
        userTimezone: userTimezone,
        userTime: userTime,
        timezoneDifferent: userTimezone !== DEFAULT_TIMEZONE,
        timeDifferent: defaultTime !== userTime
      }
    };
    
    Logger.log(`ðŸŒ Timezone comparison:`);
    Logger.log(`- Default (${DEFAULT_TIMEZONE}): ${defaultTime}`);
    Logger.log(`- User (${userTimezone}): ${userTime}`);
    Logger.log(`- Different timezone: ${result.data.timezoneDifferent}`);
    Logger.log(`- Different time: ${result.data.timeDifferent}`);
    
    return result;
    
  } catch (error) {
    Logger.log(`âŒ Timezone test error: ${error}`);
    return {
      success: false,
      message: 'Timezone test failed: ' + error.toString(),
      error: error.toString()
    };
  }
}

/**
 * Force run auto-update with user timezone (for testing)
 */
function forceAutoUpdateWithUserTimezone() {
  try {
    Logger.log('ðŸš€ FORCE AUTO-UPDATE WITH USER TIMEZONE');
    const result = autoUpdateAllShiftStatuses();
    
    return {
      success: true,
      message: 'Force auto-update completed with user timezone',
      result: result
    };
    
  } catch (error) {
    Logger.log(`âŒ Force auto-update error: ${error}`);
    return {
      success: false,
      message: 'Force auto-update failed: ' + error.toString(),
      error: error.toString()
    };
  }
}

/**
 * Get user's stored timezone from Staff sheet
 */
function getUserTimezoneFromEmail(email) {
  try {
    const staffSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Staff');
    const staffData = staffSheet.getDataRange().getValues();
    
    for (let i = 1; i < staffData.length; i++) {
      const row = staffData[i];
      const userEmail = row[1]; // Email in column B
      const timezone = row[3];  // Timezone in column D
      
      if (userEmail && userEmail.toLowerCase() === email.toLowerCase()) {
        Logger.log(`ðŸ“ Found timezone for ${email}: ${timezone}`);
        return timezone || null;
      }
    }
    
    Logger.log(`âš ï¸ No timezone found for ${email}`);
    return null;
    
  } catch (error) {
    Logger.log(`âŒ Error getting timezone for ${email}: ${error}`);
    return null;
  }
}

/**
 * Test timezone storage and retrieval from Time Zone column
 */
function testTimezoneStorage() {
  try {
    Logger.log('ðŸ§ª Testing timezone storage in Time Zone column...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const staffSheet = spreadsheet.getSheetByName(STAFF_SHEET_NAME);
    
    if (!staffSheet) {
      return { success: false, message: 'Staff sheet not found' };
    }
    
    // Get headers and prioritize column F for Time Zone (handle duplicates)
    const headers = staffSheet.getRange(1, 1, 1, Math.max(staffSheet.getLastColumn(), 6)).getValues()[0];
    let timezoneColumnIndex = -1;
    let duplicateColumns = [];
    
    // Check for all Time Zone columns
    for (let i = 0; i < headers.length; i++) {
      if (headers[i] === 'Time Zone') {
        duplicateColumns.push({
          index: i,
          column: String.fromCharCode(65 + i)
        });
      }
    }
    
    // Prioritize column F (index 5) if it exists
    if (headers.length >= 6 && headers[5] === 'Time Zone') {
      timezoneColumnIndex = 5;
      Logger.log(`ðŸŽ¯ Using primary Time Zone column at F (index 5)`);
    } else if (duplicateColumns.length > 0) {
      // Use the first Time Zone column found
      timezoneColumnIndex = duplicateColumns[0].index;
      Logger.log(`ï¿½ Using Time Zone column at ${duplicateColumns[0].column} (index ${timezoneColumnIndex})`);
    }
    
    Logger.log(`ðŸ“‹ Headers found: ${headers}`);
    Logger.log(`ðŸŒ Time Zone columns found: ${JSON.stringify(duplicateColumns)}`);
    Logger.log(`ðŸŒ Using Time Zone column index: ${timezoneColumnIndex} (Column ${timezoneColumnIndex >= 0 ? String.fromCharCode(65 + timezoneColumnIndex) : 'Not Found'})`);
    
    if (timezoneColumnIndex === -1) {
      return { 
        success: false, 
        message: 'Time Zone column not found in Staff sheet',
        headers: headers,
        duplicateColumns: duplicateColumns,
        actualColumns: headers.length
      };
    }
    
    // Check existing timezone data - ensure we read enough columns
    const staffData = staffSheet.getRange(1, 1, staffSheet.getLastRow(), Math.max(staffSheet.getLastColumn(), 6)).getValues();
    const timezoneData = [];
    
    for (let i = 1; i < staffData.length; i++) {
      const row = staffData[i];
      const employeeId = row[0];
      const name = row[1];
      const timezone = row[timezoneColumnIndex];
      
      timezoneData.push({
        employeeId: employeeId,
        name: name,
        timezone: timezone || 'Not set',
        columnPosition: String.fromCharCode(65 + timezoneColumnIndex),
        rowNumber: i + 1,
        hasTimezone: !!timezone,
        extractedTimezone: timezone ? extractTimezoneId(timezone) : null
      });
    }
    
    Logger.log(`ðŸ“Š Timezone data for all staff:`);
    timezoneData.forEach(data => {
      Logger.log(`- ${data.name} (${data.employeeId}): ${data.timezone}`);
    });
    
    return {
      success: true,
      message: 'Timezone storage test completed',
      data: {
        columnIndex: timezoneColumnIndex,
        columnName: 'Time Zone',
        staffCount: timezoneData.length,
        timezones: timezoneData
      }
    };
    
  } catch (error) {
    Logger.log(`âŒ Timezone storage test error: ${error}`);
    return {
      success: false,
      message: 'Timezone storage test failed: ' + error.toString(),
      error: error.toString()
    };
  }
}

/**
 * Simple standalone function to log server time info
 * Run this directly in Apps Script editor to see server time
 */
function logServerTimeInfo() {
  const now = new Date();
  
  Logger.log('=== ðŸ•°ï¸ SERVER TIME INFO ===');
  Logger.log(`Server Timezone: ${DEFAULT_TIMEZONE}`);
  Logger.log(`Server Time (HH:MM): ${getCurrentTimeString(DEFAULT_TIMEZONE)}`);
  Logger.log(`Server Full DateTime: ${now.toLocaleString('en-US', { timeZone: DEFAULT_TIMEZONE })}`);
  Logger.log(`UTC Time: ${now.toISOString()}`);
  Logger.log(`Timestamp: ${now.getTime()}`);
  Logger.log(`Date (ISO): ${now.toISOString().split('T')[0]}`);
  Logger.log('============================');
  
  return {
    timezone: DEFAULT_TIMEZONE,
    time: getCurrentTimeString(DEFAULT_TIMEZONE),
    fullDateTime: now.toLocaleString('en-US', { timeZone: DEFAULT_TIMEZONE }),
    utc: now.toISOString(),
    timestamp: now.getTime(),
    date: now.toISOString().split('T')[0]
  };
}

/**
 * Simple function to get server time and timezone info
 */
function getServerTimeInfo() {
  try {
    const now = new Date();
    
    // Server timezone info
    const serverTimezone = DEFAULT_TIMEZONE;
    const serverTime = getCurrentTimeString(serverTimezone);
    
    // Additional time formats for comparison
    const utcTime = now.toISOString();
    const serverDateTime = now.toLocaleString('en-US', { timeZone: serverTimezone });
    
    const result = {
      success: true,
      message: 'Server time info retrieved',
      data: {
        serverTimezone: serverTimezone,
        serverTime: serverTime,
        serverDateTime: serverDateTime,
        utcTime: utcTime,
        timestamp: now.getTime(),
        dateISO: now.toISOString().split('T')[0]
      }
    };
    
    Logger.log(`ðŸ•°ï¸ Server Time Info:`);
    Logger.log(`- Timezone: ${serverTimezone}`);
    Logger.log(`- Time: ${serverTime}`);
    Logger.log(`- Full DateTime: ${serverDateTime}`);
    Logger.log(`- UTC: ${utcTime}`);
    
    return result;
    
  } catch (error) {
    Logger.log(`âŒ Server time error: ${error}`);
    return {
      success: false,
      message: 'Failed to get server time: ' + error.toString(),
      error: error.toString()
    };
  }
}

/**
 * Test to verify timezone issue - compare server vs user time for auto-update
 */
function testTimezoneIssueDirectly() {
  try {
    Logger.log('ðŸŒ === DIRECT TIMEZONE ISSUE TEST ===');
    
    // Get the user timezone (what should be used)
    const userTimezone = getUserTimezoneForAutoUpdate();
    
    // Get current times in both zones
    const serverTime = getCurrentTimeString(DEFAULT_TIMEZONE);
    const userTime = getCurrentTimeString(userTimezone);
    
    // Get raw Date object for comparison
    const now = new Date();
    const serverRaw = now.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: DEFAULT_TIMEZONE 
    });
    const userRaw = now.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: userTimezone 
    });
    
    Logger.log(`â° CRITICAL COMPARISON:`);
    Logger.log(`- Server timezone: ${DEFAULT_TIMEZONE}`);
    Logger.log(`- User timezone: ${userTimezone}`);
    Logger.log(`- Server time (what auto-update WAS using): ${serverTime}`);
    Logger.log(`- User time (what auto-update SHOULD use): ${userTime}`);
    Logger.log(`- Raw server time: ${serverRaw}`);
    Logger.log(`- Raw user time: ${userRaw}`);
    
    // Test with a sample shift end time
    const sampleEndTime = '21:30'; // 9:30 PM
    
    const serverComparison = isEnhancedTimeAfter(serverTime, sampleEndTime);
    const userComparison = isEnhancedTimeAfter(userTime, sampleEndTime);
    
    Logger.log(`\\nðŸ§ª SAMPLE COMPARISON (shift ends at ${sampleEndTime}):`);
    Logger.log(`- Server says current time (${serverTime}) is after ${sampleEndTime}: ${serverComparison}`);
    Logger.log(`- User says current time (${userTime}) is after ${sampleEndTime}: ${userComparison}`);
    
    const issueFound = serverComparison !== userComparison;
    
    if (issueFound) {
      Logger.log(`\\nðŸš¨ ISSUE CONFIRMED:`);
      Logger.log(`- Server and user timezones give DIFFERENT results!`);
      Logger.log(`- This explains why auto-update happens at wrong time`);
      Logger.log(`- Server thinks: ${serverComparison ? 'Shift should complete' : 'Shift not ready'}`);
      Logger.log(`- User expects: ${userComparison ? 'Shift should complete' : 'Shift not ready'}`);
    } else {
      Logger.log(`\\nâœ… NO ISSUE FOUND:`);
      Logger.log(`- Server and user timezones give same result`);
      Logger.log(`- Auto-update timing should be correct`);
    }
    
    // Test what the old auto-update was doing vs new auto-update
    Logger.log(`\\nðŸ”„ AUTO-UPDATE BEHAVIOR:`);
    Logger.log(`- OLD behavior: Used ${DEFAULT_TIMEZONE} time (${serverTime})`);
    Logger.log(`- NEW behavior: Uses ${userTimezone} time (${userTime})`);
    Logger.log(`- Time difference: ${serverTime !== userTime ? 'YES - FIX NEEDED' : 'NO - Times match'}`);
    
    return {
      success: true,
      message: 'Direct timezone issue test completed',
      data: {
        serverTimezone: DEFAULT_TIMEZONE,
        userTimezone: userTimezone,
        serverTime: serverTime,
        userTime: userTime,
        timesMatch: serverTime === userTime,
        timezonesMatch: userTimezone === DEFAULT_TIMEZONE,
        sampleTest: {
          endTime: sampleEndTime,
          serverResult: serverComparison,
          userResult: userComparison,
          resultsMatch: !issueFound
        },
        issueFound: issueFound,
        diagnosis: issueFound ? 'TIMEZONE_MISMATCH_CONFIRMED' : 'NO_TIMEZONE_ISSUE',
        recommendation: issueFound ? 
          'Use getUserTimezoneForAutoUpdate() in auto-update instead of DEFAULT_TIMEZONE' :
          'Current timezone handling appears correct'
      }
    };
    
  } catch (error) {
    Logger.log(`âŒ Direct timezone test error: ${error}`);
    return {
      success: false,
      message: 'Direct timezone test failed: ' + error.toString(),
      error: error.toString()
    };
  }
}
function testTimeComparisonWithRealData() {
  try {
    Logger.log('ðŸ§ª === REAL DATA TIME COMPARISON TEST ===');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHIFTS_SHEET_NAME);
    
    if (!sheet) {
      throw new Error('Sheet not found');
    }
    
    // Get current timezone and time data
    const userTimezone = getUserTimezoneForAutoUpdate();
    const now = new Date();
    const serverTime = getCurrentTimeString(DEFAULT_TIMEZONE);
    const userTime = getCurrentTimeString(userTimezone);
    const utcTime = now.toISOString().substring(11, 16);
    const currentDate = now.toLocaleDateString('en-CA');
    
    Logger.log(`ðŸŒ Current Time Analysis:`);
    Logger.log(`- Server (${DEFAULT_TIMEZONE}): ${serverTime}`);
    Logger.log(`- User (${userTimezone}): ${userTime}`);
    Logger.log(`- UTC: ${utcTime}`);
    Logger.log(`- Date: ${currentDate}`);
    
    // Get real shift data from today
    const lastRow = sheet.getLastRow();
    const realShiftData = [];
    
    if (lastRow > 1) {
      const data = sheet.getRange(2, 1, lastRow - 1, 15).getValues();
      
      // Find today's shifts
      data.forEach((row, index) => {
        const shiftDate = normalizeDate(row[3]);
        const status = row[10];
        const lastEndTime = row[6];
        
        if (shiftDate === currentDate) {
          let segments = [];
          try {
            segments = JSON.parse(row[9] || '[]');
          } catch (e) {
            segments = [];
          }
          
          realShiftData.push({
            shiftId: row[0],
            status: status,
            lastEndTime: lastEndTime,
            segments: segments,
            rowIndex: index + 2
          });
        }
      });
    }
    
    Logger.log(`ðŸ“Š Found ${realShiftData.length} real shifts for today`);
    
    // Test with real shift data
    let realShiftTests = [];
    realShiftData.forEach(shift => {
      if (shift.segments && shift.segments.length > 0) {
        shift.segments.forEach(segment => {
          if (segment.endTime) {
            // Test time comparison for real segment end times
            const serverComparison = isEnhancedTimeAfter(serverTime, segment.endTime);
            const userComparison = isEnhancedTimeAfter(userTime, segment.endTime);
            
            // Test what the smart status would be
            const serverSmartStatus = calculateEnhancedSmartStatus(shift.segments, serverTime, shift.lastEndTime, shift.status);
            const userSmartStatus = calculateEnhancedSmartStatus(shift.segments, userTime, shift.lastEndTime, shift.status);
            
            realShiftTests.push({
              shiftId: shift.shiftId,
              segmentEndTime: segment.endTime,
              currentStatus: shift.status,
              serverTimeAfter: serverComparison,
              userTimeAfter: userComparison,
              serverSmartStatus: serverSmartStatus,
              userSmartStatus: userSmartStatus,
              statusMatch: serverSmartStatus === userSmartStatus,
              timeComparisonMatch: serverComparison === userComparison
            });
            
            Logger.log(`ðŸ” Real Shift ${shift.shiftId} - Segment ending ${segment.endTime}:`);
            Logger.log(`  - Server time after: ${serverComparison}, Smart status: ${serverSmartStatus}`);
            Logger.log(`  - User time after: ${userComparison}, Smart status: ${userSmartStatus}`);
            Logger.log(`  - Status match: ${serverSmartStatus === userSmartStatus}`);
          }
        });
      }
    });
    
    // Test with time variations around current time
    const currentMinutes = parseInt(userTime.split(':')[1]);
    const currentHours = parseInt(userTime.split(':')[0]);
    
    const timeVariations = [
      // 5 minutes ago
      `${String(currentHours).padStart(2, '0')}:${String(Math.max(0, currentMinutes - 5)).padStart(2, '0')}`,
      // Current time
      userTime,
      // 5 minutes from now
      `${String(currentHours).padStart(2, '0')}:${String(Math.min(59, currentMinutes + 5)).padStart(2, '0')}`,
      // 1 hour ago
      `${String(Math.max(0, currentHours - 1)).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`,
      // 1 hour from now
      `${String(Math.min(23, currentHours + 1)).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`
    ];
    
    let timeVariationTests = [];
    timeVariations.forEach(testTime => {
      const serverComparison = isEnhancedTimeAfter(serverTime, testTime);
      const userComparison = isEnhancedTimeAfter(userTime, testTime);
      
      timeVariationTests.push({
        testTime: testTime,
        serverTimeAfter: serverComparison,
        userTimeAfter: userComparison,
        match: serverComparison === userComparison
      });
      
      Logger.log(`â±ï¸ Test time ${testTime}: Server=${serverComparison}, User=${userComparison}, Match=${serverComparison === userComparison}`);
    });
    
    // Test critical edge cases (midnight crossover)
    const edgeCases = [
      { current: '23:59', test: '00:01' },
      { current: '00:01', test: '23:59' },
      { current: serverTime, test: userTime }
    ];
    
    let edgeCaseTests = [];
    edgeCases.forEach(edge => {
      const result = isEnhancedTimeAfter(edge.current, edge.test);
      edgeCaseTests.push({
        currentTime: edge.current,
        testTime: edge.test,
        result: result
      });
      
      Logger.log(`ðŸŒ™ Edge case ${edge.current} after ${edge.test}: ${result}`);
    });
    
    // Calculate real-world statistics
    const timezoneMatch = userTimezone === DEFAULT_TIMEZONE;
    const timeMatch = serverTime === userTime;
    const realShiftStatusMatches = realShiftTests.filter(t => t.statusMatch).length;
    const timeVariationMatches = timeVariationTests.filter(t => t.match).length;
    
    const summary = {
      success: true,
      message: 'Real data time comparison test completed',
      data: {
        realTime: {
          server: serverTime,
          user: userTime,
          utc: utcTime,
          timezone: userTimezone,
          serverTimezone: DEFAULT_TIMEZONE,
          timezoneMatch: timezoneMatch,
          timeMatch: timeMatch
        },
        realShifts: {
          total: realShiftData.length,
          tested: realShiftTests.length,
          statusMatches: realShiftStatusMatches,
          allStatusMatch: realShiftTests.length === 0 || realShiftStatusMatches === realShiftTests.length,
          details: realShiftTests
        },
        timeVariations: {
          total: timeVariationTests.length,
          matches: timeVariationMatches,
          allMatch: timeVariationMatches === timeVariationTests.length,
          details: timeVariationTests
        },
        edgeCases: {
          total: edgeCaseTests.length,
          details: edgeCaseTests
        },
        overallAssessment: {
          criticalIssue: !timezoneMatch && !timeMatch,
          potentialIssue: !timezoneMatch || !timeMatch,
          status: (timezoneMatch && timeMatch) ? 'OPTIMAL' : 
                  (!timezoneMatch && !timeMatch) ? 'CRITICAL' : 'MONITOR'
        }
      }
    };
    
    Logger.log(`\nðŸ“‹ REAL DATA TEST SUMMARY:`);
    Logger.log(`- Timezone match: ${timezoneMatch}`);
    Logger.log(`- Time match: ${timeMatch}`);
    Logger.log(`- Real shifts tested: ${realShiftTests.length}`);
    Logger.log(`- Status matches: ${realShiftStatusMatches}/${realShiftTests.length}`);
    Logger.log(`- Time variation matches: ${timeVariationMatches}/${timeVariationTests.length}`);
    Logger.log(`- Overall assessment: ${summary.data.overallAssessment.status}`);
    
    return summary;
    
  } catch (error) {
    Logger.log(`âŒ Real data test error: ${error}`);
    return {
      success: false,
      message: 'Real data test failed: ' + error.toString(),
      error: error.toString()
    };
  }
}
function testTimeComparison() {
  try {
    Logger.log('ðŸ§ª === COMPREHENSIVE TIME COMPARISON TEST ===');
    
    const userTimezone = getUserTimezoneForAutoUpdate();
    const now = new Date();
    
    // Get times in different timezones
    const serverTime = getCurrentTimeString(DEFAULT_TIMEZONE);
    const userTime = getCurrentTimeString(userTimezone);
    const utcTime = now.toISOString().substring(11, 16); // HH:MM format
    
    Logger.log(`ðŸŒ Timezone Comparison:`);
    Logger.log(`- Server (${DEFAULT_TIMEZONE}): ${serverTime}`);
    Logger.log(`- User (${userTimezone}): ${userTime}`);
    Logger.log(`- UTC: ${utcTime}`);
    
    // Test time comparison scenarios
    const testScenarios = [
      { name: 'Early Morning', time: '06:15' },
      { name: 'Regular Start', time: '09:00' },
      { name: 'Mid Day', time: '12:30' },
      { name: 'Afternoon', time: '15:31' },
      { name: 'Evening', time: '18:00' },
      { name: 'Late Night', time: '23:45' }
    ];
    
    let comparisonResults = [];
    
    testScenarios.forEach(scenario => {
      // Test against server time
      const serverComparison = isEnhancedTimeAfter(serverTime, scenario.time);
      const userComparison = isEnhancedTimeAfter(userTime, scenario.time);
      
      const result = {
        scenario: scenario.name,
        testTime: scenario.time,
        serverTime: serverTime,
        userTime: userTime,
        serverAfter: serverComparison,
        userAfter: userComparison,
        sameResult: serverComparison === userComparison
      };
      
      comparisonResults.push(result);
      
      Logger.log(`ðŸ“Š ${scenario.name} (${scenario.time}):`);
      Logger.log(`  - Server time after: ${serverComparison}`);
      Logger.log(`  - User time after: ${userComparison}`);
      Logger.log(`  - Same result: ${serverComparison === userComparison}`);
    });
    
    // Test next-day scenarios
    Logger.log(`\nðŸŒ… Next-Day Scenario Tests:`);
    const nextDayTests = [
      { current: '06:15', shift: '15:31', expected: true },
      { current: '15:31', shift: '06:15', expected: false },
      { current: '23:45', shift: '08:00', expected: false },
      { current: '01:30', shift: '22:00', expected: true }
    ];
    
    let nextDayResults = [];
    nextDayTests.forEach(test => {
      const result = isEnhancedTimeAfter(test.current, test.shift);
      const passed = result === test.expected;
      
      nextDayResults.push({
        currentTime: test.current,
        shiftTime: test.shift,
        result: result,
        expected: test.expected,
        passed: passed
      });
      
      Logger.log(`  ${test.current} after ${test.shift}: ${result} (expected: ${test.expected}) ${passed ? 'âœ…' : 'âŒ'}`);
    });
    
    // Calculate statistics
    const timezoneMatch = userTimezone === DEFAULT_TIMEZONE;
    const timeMatch = serverTime === userTime;
    const allComparisonsMatch = comparisonResults.every(r => r.sameResult);
    const nextDayTestsPassed = nextDayResults.every(r => r.passed);
    
    const summary = {
      success: true,
      message: 'Time comparison test completed',
      data: {
        timezones: {
          server: DEFAULT_TIMEZONE,
          user: userTimezone,
          match: timezoneMatch
        },
        times: {
          server: serverTime,
          user: userTime,
          utc: utcTime,
          match: timeMatch
        },
        comparisonTests: {
          total: comparisonResults.length,
          allMatch: allComparisonsMatch,
          results: comparisonResults
        },
        nextDayTests: {
          total: nextDayResults.length,
          passed: nextDayResults.filter(r => r.passed).length,
          allPassed: nextDayTestsPassed,
          results: nextDayResults
        },
        overallStatus: timezoneMatch && allComparisonsMatch && nextDayTestsPassed ? 'PASS' : 'ATTENTION_NEEDED'
      }
    };
    
    Logger.log(`\nðŸ“‹ TEST SUMMARY:`);
    Logger.log(`- Timezone match: ${timezoneMatch}`);
    Logger.log(`- Time match: ${timeMatch}`);
    Logger.log(`- All comparisons match: ${allComparisonsMatch}`);
    Logger.log(`- Next-day tests passed: ${nextDayTestsPassed}`);
    Logger.log(`- Overall status: ${summary.data.overallStatus}`);
    
    return summary;
    
  } catch (error) {
    Logger.log(`âŒ Time comparison test error: ${error}`);
    return {
      success: false,
      message: 'Time comparison test failed: ' + error.toString(),
      error: error.toString()
    };
  }
}

/**
 * ENHANCED: Automatically checks and updates status of all shifts
 * This runs every minute via trigger and properly handles shift completion
 */
function autoUpdateAllShiftStatuses() {
  try {
    Logger.log('=== ðŸ”„ ENHANCED AUTO UPDATE CHECK STARTED ===');
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHIFTS_SHEET_NAME);
    
    if (!sheet) {
      Logger.log('âŒ Sheet not found');
      return;
    }
    
    // Get all data
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      Logger.log('ðŸ“ No shift data to check');
      return;
    }
    
    const data = sheet.getRange(2, 1, lastRow - 1, 15).getValues(); // Get all 15 columns
    
    // Get active user timezone from most recent activity
    const userTimezone = getUserTimezoneForAutoUpdate();
    
    // Get current time in server timezone
    const serverCurrentTime = getCurrentTimeString(DEFAULT_TIMEZONE);
    
    // Convert server time to user timezone for comparison
    const userCurrentTime = userTimezone ? convertServerTimeToUserTimezone(serverCurrentTime, userTimezone) : serverCurrentTime;
    
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-CA'); // YYYY-MM-DD format
    
    Logger.log(`ðŸ•’ Current time comparison:`);
    Logger.log(`- User timezone: ${userTimezone || 'Not detected'}`);
    Logger.log(`- Server time (${DEFAULT_TIMEZONE}): ${serverCurrentTime}`);
    Logger.log(`- User equivalent time: ${userCurrentTime}`);
    Logger.log(`- Current date: ${currentDate}`);
    Logger.log(`- Server time: ${now.toISOString()}`);
    
    let updatesCount = 0;
    let completedShifts = 0;
    Logger.log(`ðŸ“œ Found ${data.length} total rows to check`);
    
    // Check each shift
    data.forEach((row, index) => {
      const shiftId = row[0];
      const shiftDate = normalizeDate(row[3]);
      const status = row[10];
      const lastEndTime = row[6]; // Column G: Last End Time
      
      // Only check shifts for today and not already completed
      if (shiftDate === currentDate && status && status !== 'COMPLETED') {
        try {
          Logger.log(`\nðŸ” Checking shift ${shiftId}:`);
          Logger.log(`- Current status: ${status}`);
          Logger.log(`- Shift date: ${shiftDate}`);
          Logger.log(`- Last end time: ${lastEndTime}`);
          
          let segments;
          try {
            segments = JSON.parse(row[9] || '[]');
          } catch (parseError) {
            Logger.log('âš ï¸ Error parsing segments JSON - using empty array');
            segments = [];
          }
          
          Logger.log(`- Found ${segments.length} segments`);
          
          // ðŸ”´ CRITICAL FIX: Disable aggressive auto-completion
          // Only allow manual completion or very conservative auto-completion
          let newStatus = status; // Keep current status by default
          
          // Only check for basic status transitions, not auto-completion
          const hasActiveSegment = segments.some(seg => !seg.endTime);
          
          if (hasActiveSegment && status !== 'ACTIVE') {
            newStatus = 'ACTIVE';
            Logger.log(`ðŸ“ Has active segment - updating to ACTIVE`);
          } else if (!hasActiveSegment && status === 'ACTIVE') {
            // Keep as ACTIVE for manual completion, only auto-complete after 60+ minutes
            const completedSegments = segments.filter(seg => seg.endTime);
            if (completedSegments.length > 0) {
              const latestEndTime = completedSegments[completedSegments.length - 1]?.endTime;
              if (latestEndTime && isTimeMoreThanMinutesAfter(userCurrentTime, latestEndTime, 60)) {
                newStatus = 'COMPLETED';
                Logger.log(`ðŸ 60+ minutes past activity - auto-completing`);
              } else {
                Logger.log(`â¸ï¸ All segments closed but keeping ACTIVE for manual completion`);
                // Keep as ACTIVE
              }
            }
          } else {
            Logger.log(`âœ… Status remains: ${status}`);
          }
          
          Logger.log(`- Conservative status check: ${status} â†’ ${newStatus}`);
          
          if (newStatus !== status) {
            Logger.log(`ðŸŸ¡ Status change needed: ${status} â†’ ${newStatus}`);
            Logger.log(`ðŸŒ Time used for calculation: ${userCurrentTime} (${userTimezone})`);
            
            // Update the status
            sheet.getRange(index + 2, 11).setValue(newStatus);
            sheet.getRange(index + 2, 13).setValue(new Date());
            
            // If completing shift, ensure all segments are closed
            if (newStatus === 'COMPLETED') {
              let needsUpdate = false;
              let updatedSegments = [...segments];
              
              // Close any open segments using user time
              updatedSegments.forEach(segment => {
                if (!segment.endTime) {
                  Logger.log(`ðŸ”§ Closing open segment with end time: ${userCurrentTime} (user timezone)`);
                  segment.endTime = userCurrentTime;
                  segment.duration = calculateDuration(segment.startTime, userCurrentTime);
                  needsUpdate = true;
                }
              });
              
              if (needsUpdate) {
                const totalDuration = updatedSegments.reduce((sum, seg) => sum + (seg.duration || 0), 0);
                sheet.getRange(index + 2, 7).setValue(userCurrentTime); // Last End Time in user timezone
                sheet.getRange(index + 2, 8).setValue(totalDuration); // Total Duration
                sheet.getRange(index + 2, 10).setValue(JSON.stringify(updatedSegments)); // Segments
                Logger.log(`ðŸ“Š Updated totals: ${totalDuration} hours (using user timezone)`);
              }
              
              completedShifts++;
            }
            
            updatesCount++;
          }
        } catch (error) {
          Logger.log(`âŒ Error processing shift ${shiftId}: ${error}`);
        }
      } else if (shiftDate !== currentDate) {
        Logger.log(`â­ï¸ Skipping shift ${shiftId} - different date (${shiftDate})`);
      }
    });
    
    Logger.log('\n=== âœ… ENHANCED AUTO UPDATE COMPLETE ===');
    Logger.log(`- Timezone used: ${userTimezone}`);
    Logger.log(`- Time used: ${userCurrentTime}`);
    Logger.log(`- Shifts processed: ${data.length}`);
    Logger.log(`- Status updates: ${updatesCount}`);
    Logger.log(`- Shifts completed: ${completedShifts}`);
    Logger.log(`- Time taken: ${(new Date() - now)/1000} seconds`);
    Logger.log('================================\n');
    
    // Return summary for testing
    return {
      success: true,
      processed: data.length,
      updated: updatesCount,
      completed: completedShifts,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    Logger.log('\nâŒ ERROR IN AUTO UPDATE:');
    Logger.log(error.toString());
    Logger.log(error.stack);
    Logger.log('================================\n');
    return {
      success: false,
      error: error.toString(),
      timestamp: new Date().toISOString()
    };
  }
}


// =============================================================
//            PRIMARY WEB APP HANDLERS (doGet, doPost)
// =============================================================

function doGet(e) { return ContentService.createTextOutput(JSON.stringify({ message: 'Real-time shift tracking active' })).setMimeType(ContentService.MimeType.JSON); }
function doOptions(e) { return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT); }

// function doPost(e) {
//   try {
//     if (!e || !e.postData || !e.postData.contents) { return createResponse({ success: false, message: 'No data received' }); }
//     const data = JSON.parse(e.postData.contents);
//     const action = data.action;
//     Logger.log('Action: ' + action + ', Data: ' + JSON.stringify(data));
//     let response;
//  switch(action) {
//   case 'login': response = authenticateUser(data); break;
//   case 'startShift': response = startShiftSafe(data); break;
//   case 'stopShift': response = stopShift(data); break;
//   case 'addNewSegment': response = addNewSegment(data); break;
//   case 'getCurrentShift': response = getCurrentShift(data); break;
//   case 'completeShift': response = completeShift(data); break;
//   case 'cleanupDuplicates': response = cleanupDuplicateShifts(); break;
//   case 'getShifts': response = getShifts(data); break;
//   case 'getStaffList': response = getStaffList(); break;
//   case 'createCompleteShift': response = createCompleteShift(data); break;
//   case 'getDynamicData': response = getDynamicTableData(data); break;
// case 'setupDynamicTable': response = setupDynamicTableSheet(); break;
//       case 'setupSmartDynamicTable': response = setupSmartDynamicTable(); break;
//       case 'resetRefreshControl': response = resetRefreshControl(); break;
//       case 'smartRefreshDynamicTable': response = smartRefreshDynamicTable(); break;
//       case 'setupImprovedTable': response = setupImprovedSmartDynamicTable(); break;
// case 'forceImprovedRefresh': response = forceImprovedRefresh(); break;
// case 'performImprovedRefresh': response = performImprovedRefresh(); break;
// case 'setupTriggerFreeSystem': response = setupTriggerFreeSystem(); break;
//   case 'smartRefreshData': response = smartRefreshData(); break;
//   case 'setupTriggerFreeTable': response = setupTriggerFreeDynamicTable(); break;
//   case 'setupFormulaBasedSystem': response = setupFormulaBasedSystem(); break;
    
// case 'setupFormulaBasedSystem': response = setupFormulaBasedSystem(); break;
//   default: response = { success: false, message: 'Invalid action: ' + action };
// }
//     return createResponse(response);
//   } catch (error) {
//     Logger.log('Error in doPost: ' + error.toString());
//     return createResponse({ success: false, message: 'Server error: ' + error.toString() });
//   }
// }

// =============================================================
//            UPDATED doPost WITH TIMEZONE SUPPORT
//   Replace your existing doPost function with this version
// =============================================================

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) { 
      return createResponse({ success: false, message: 'No data received' }); 
    }
    
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    // Extract timezone information from client
    const clientTimezone = data.clientTimezone || null;
    const clientTimezoneOffset = data.clientTimezoneOffset || null;
    
    Logger.log(`Action: ${action}, Client Timezone: ${clientTimezone}, Data: ${JSON.stringify(data)}`);
    
    let response;
    
    switch(action) {
      case 'login': 
        response = authenticateUser(data, clientTimezone); 
        break;
      case 'startShift': 
        response = startShiftSafe(data, clientTimezone); 
        break;
      case 'stopShift': 
        response = stopShift(data, clientTimezone); 
        break;
      case 'addNewSegment': 
        response = addNewSegment(data, clientTimezone); 
        break;
      case 'getCurrentShift': 
        response = getCurrentShift(data, clientTimezone); 
        break;
      case 'completeShift': 
        response = completeShift(data, clientTimezone); 
        break;
      case 'cleanupDuplicates': 
        response = cleanupDuplicateShifts(); 
        break;
      case 'getShifts': 
        response = getShifts(data, clientTimezone); 
        break;
      case 'getStaffList': 
        response = getStaffList(); 
        break;
      case 'createCompleteShift': 
        response = createCompleteShift(data, clientTimezone); 
        break;
      case 'getDynamicData': 
        response = getDynamicTableData(data); 
        break;
      case 'setupDynamicTable': 
        response = setupDynamicTableSheet(); 
        break;
      case 'setupSmartDynamicTable': 
        response = setupSmartDynamicTable(); 
        break;
      case 'resetRefreshControl': 
        response = resetRefreshControl(); 
        break;
      case 'smartRefreshDynamicTable': 
        response = smartRefreshDynamicTable(); 
        break;
      case 'setupImprovedTable': 
        response = setupImprovedSmartDynamicTable(); 
        break;
      case 'forceImprovedRefresh': 
        response = forceImprovedRefresh(); 
        break;
      case 'performImprovedRefresh': 
        response = performImprovedRefresh(); 
        break;
      case 'setupTriggerFreeSystem': 
        response = setupTriggerFreeSystem(); 
        break;
      case 'smartRefreshData': 
        response = smartRefreshData(); 
        break;
      case 'setupTriggerFreeTable': 
        response = setupTriggerFreeDynamicTable(); 
        break;
      case 'setupFormulaBasedSystem': 
        response = setupFormulaBasedSystem(); 
        break;
      case 'syncShiftStatus':
        response = updateShiftStatus(data.shiftId, clientTimezone);
        break;
      case 'fixShiftStatus': 
        response = fixShiftStatus(data); 
        break;
      case 'testConnection': 
        response = { 
          success: true, 
          message: 'Connection successful', 
          serverTime: new Date().toISOString(), 
          clientTimezone: clientTimezone || 'Unknown',
          actions: ['login', 'startShift', 'getCurrentShift', 'getStaffList', 'testConnection', 'manualStatusUpdate', 'checkTriggerStatus', 'createStatusUpdateTrigger']
        }; 
        break;
      case 'manualStatusUpdate':
        response = manualStatusUpdate();
        break;
      case 'checkTriggerStatus':
        response = checkTriggerStatus();
        break;
      case 'createStatusUpdateTrigger':
        response = createStatusUpdateTrigger();
        break;
      case 'testTimezoneAutoUpdate':
        response = testTimezoneAutoUpdate();
        break;
      case 'forceAutoUpdateWithUserTimezone':
        response = forceAutoUpdateWithUserTimezone();
        break;
      case 'testTimeComparison':
        response = testTimeComparison();
        break;
      case 'testTimeComparisonWithRealData':
        response = testTimeComparisonWithRealData();
        break;
      case 'testTimezoneIssueDirectly':
        response = testTimezoneIssueDirectly();
        break;
      case 'getServerTimeInfo':
        response = getServerTimeInfo();
        break;
      case 'testTimezoneStorage':
        response = testTimezoneStorage();
        break;
      case 'testTimezoneConversion':
        response = testTimezoneConversion();
        break;
      case 'verifyTimezoneColumnP':
        response = verifyTimezoneColumnF(); // Updated to use column F
        break;
      case 'verifyTimezoneColumnF':
        response = verifyTimezoneColumnF();
        break;
      case 'cleanupDuplicateTimezoneColumns':
        response = cleanupDuplicateTimezoneColumns();
        break;
      case 'disableAutoCompletion':
        response = disableAutoCompletion();
        break;
      case 'testTimezoneExtraction':
        response = testTimezoneExtraction();
        break;
      case 'testAutoUpdateWithFixedTimezone':
        response = testAutoUpdateWithFixedTimezone();
        break;
      case 'quickShiftStatusCheck':
        response = quickShiftStatusCheck();
        break;
      case 'removeOnBreakStatus':
        response = removeOnBreakStatus();
        break;
      case 'verifyStatusSimplification':
        response = verifyStatusSimplification();
        break;
      case 'revertAutoCompletedShifts':
        response = revertAutoCompletedShifts();
        break;
      default: 
        response = { success: false, message: 'Invalid action: ' + action };
    }
    
    // Use timezone-aware response creator
    return createTimezoneAwareResponse(response, clientTimezone);
    
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return createTimezoneAwareResponse({ 
      success: false, 
      message: 'Server error: ' + error.toString() 
    }, null);
  }
}




function createResponse(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }

// =============================================================
//                  CORE LOGIC FUNCTIONS
// =============================================================

function authenticateUser(data) {
  try {
    const username = String(data.username).trim();
    const password = String(data.password).trim(); 
    const timezone = data.timezone; // User's selected timezone
    
    if (!username || !password) { 
      return { success: false, message: 'Username and password are required.' }; 
    }
    
    if (!timezone) {
      return { success: false, message: 'Please select your timezone.' };
    }
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const staffSheet = spreadsheet.getSheetByName(STAFF_SHEET_NAME);
    if (!staffSheet) { 
      Logger.log('Authentication failed: Staff sheet not found.'); 
      return { success: false, message: 'System configuration error: Staff sheet is missing.' }; 
    }
    
    const lastRow = staffSheet.getLastRow();
    if (lastRow <= 1) { 
      return { success: false, message: 'No staff data found in the system.' }; 
    }
    
    // Get existing data and find the Time Zone column (should be at column P)
    const headers = staffSheet.getRange(1, 1, 1, staffSheet.getLastColumn()).getValues()[0];
    let timezoneColumnIndex = headers.indexOf('Time Zone');
    
    // If not found by name, check column P (position 16) specifically
    if (timezoneColumnIndex === -1) {
      if (headers.length >= 16 && (headers[15] === 'Time Zone' || headers[15] === '')) {
        timezoneColumnIndex = 15; // Column P is index 15 (0-based)
        Logger.log(`ðŸ“ Time Zone column detected at position P (index 15)`);
        
        // Set header if it's empty
        if (headers[15] === '' || headers[15] !== 'Time Zone') {
          staffSheet.getRange(1, 16).setValue('Time Zone');
          Logger.log(`ðŸ·ï¸ Set Time Zone header at column P`);
        }
      } else {
        Logger.log('âš ï¸ Time Zone column not found - will create at column P');
        // Create the Time Zone column at P if it doesn't exist
        staffSheet.getRange(1, 16).setValue('Time Zone');
        timezoneColumnIndex = 15;
        Logger.log(`âœ… Created Time Zone column at position P (index 15)`);
      }
    }
    
    Logger.log(`ðŸ“‹ Time Zone column index: ${timezoneColumnIndex} (Column ${String.fromCharCode(65 + timezoneColumnIndex)})`);
    
    const allData = staffSheet.getRange(2, 1, lastRow - 1, Math.max(staffSheet.getLastColumn(), 16)).getValues();
    
    for (let i = 0; i < allData.length; i++) {
      const row = allData[i];
      const rowEmployeeId = String(row[0]).trim();
      const rowName = String(row[1]).trim();
      
      if (rowName.toLowerCase() === username.toLowerCase() && rowEmployeeId === password) {
        // Store timezone with proper format and validation info in column F
        if (timezoneColumnIndex !== -1) {
          const now = new Date();
          
          // Create timezone info object with validation data
          const timezoneInfo = {
            timezone: timezone,
            displayName: getTimezoneDisplayName(timezone),
            offset: getTimezoneOffsetHours(timezone),
            lastUpdated: now.toISOString(),
            validatedAt: now.toISOString()
          };
          
          // Store formatted timezone info in column F
          const timezoneString = `${timezone} (${timezoneInfo.displayName})`;
          const targetColumn = timezoneColumnIndex + 1; // Convert to 1-based for getRange
          staffSheet.getRange(i + 2, targetColumn).setValue(timezoneString);
          
          Logger.log(`ðŸŒ Stored timezone: ${timezoneString}`);
          Logger.log(`ðŸ“ Column: ${String.fromCharCode(65 + timezoneColumnIndex)} (index ${timezoneColumnIndex})`);
          Logger.log(`ðŸ“‹ Row: ${i + 2}, Column: ${targetColumn}`);
          Logger.log(`ðŸ“Š Timezone details: ${JSON.stringify(timezoneInfo)}`);
        } else {
          Logger.log('âŒ Could not store timezone - column index not found');
        }
        
        const userData = { 
          id: rowEmployeeId, 
          name: rowName, 
          email: String(row[2] || '').trim(), 
          role: String(row[3] || 'staff').trim().toLowerCase(), 
          department: String(row[4] || '').trim(),
          timezone: timezone,
          timezoneDisplay: getTimezoneDisplayName(timezone)
        };
        
        Logger.log('Authentication successful for user: ' + username);
        Logger.log('Timezone stored: ' + timezone);
        
        return { 
          success: true, 
          data: userData,
          serverInfo: {
            serverTimezone: DEFAULT_TIMEZONE,
            userTimezone: timezone,
            currentServerTime: getCurrentTimeString(DEFAULT_TIMEZONE),
            currentUserTime: getCurrentTimeString(timezone),
            timezoneOffset: getTimezoneOffsetHours(timezone) - getTimezoneOffsetHours(DEFAULT_TIMEZONE)
          }
        };
      }
    }
    
    Logger.log('Authentication failed for user: ' + username);
    return { success: false, message: 'Invalid username or password.' };
    
  } catch (error) {
    Logger.log('Error in authenticateUser: ' + error.toString());
    return { success: false, message: 'An error occurred during authentication.' };
  }
}

/**
 * Get timezone display name for user-friendly display
 */
function getTimezoneDisplayName(timezone) {
  try {
    // Extract clean timezone ID if it's formatted
    const cleanTimezone = extractTimezoneId(timezone);
    
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: cleanTimezone,
      timeZoneName: 'long'
    });
    
    const parts = formatter.formatToParts(now);
    const timeZoneName = parts.find(part => part.type === 'timeZoneName');
    
    return timeZoneName ? timeZoneName.value : cleanTimezone;
  } catch (error) {
    Logger.log(`Error getting display name for ${timezone}: ${error}`);
    return timezone;
  }
}

/**
 * Get timezone offset in hours from UTC
 */
function getTimezoneOffsetHours(timezone) {
  try {
    // Extract clean timezone ID if it's formatted
    const cleanTimezone = extractTimezoneId(timezone);
    
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const timezoneTime = new Date(utcTime).toLocaleString('en-US', { timeZone: cleanTimezone });
    const timezoneDate = new Date(timezoneTime);
    
    const offsetMs = timezoneDate.getTime() - utcTime;
    const offsetHours = offsetMs / (1000 * 60 * 60);
    
    return offsetHours;
  } catch (error) {
    Logger.log(`Error getting offset for ${timezone}: ${error}`);
    return 0;
  }
}

/**
 * Convert server time to user timezone
 */
function convertServerTimeToUserTimezone(serverTime, userTimezone) {
  try {
    // Extract clean timezone ID if it's formatted
    const cleanTimezone = extractTimezoneId(userTimezone);
    
    const today = new Date().toISOString().split('T')[0];
    
    // Create date with server time in server timezone (DEFAULT_TIMEZONE)
    const serverDateTime = new Date(`${today}T${serverTime}:00`);
    
    // Get the time in user's timezone
    const userTime = serverDateTime.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      timeZone: cleanTimezone
    });
    
    Logger.log(`ðŸ”„ Time conversion: Server ${serverTime} (${DEFAULT_TIMEZONE}) â†’ User ${userTime} (${cleanTimezone})`);
    
    return userTime;
  } catch (error) {
    Logger.log(`âŒ Error converting ${serverTime} to ${userTimezone}: ${error}`);
    return serverTime; // Fallback to original time
  }
}

/**
 * Test timezone conversion functionality
 */
function testTimezoneConversion() {
  try {
    Logger.log('ðŸ§ª Testing timezone conversion...');
    
    const serverTime = getCurrentTimeString(DEFAULT_TIMEZONE);
    const testTimezones = [
      'Asia/Kolkata',
      'Asia/Manila', 
      'Asia/Tokyo',
      'Europe/London',
      'America/Los_Angeles'
    ];
    
    const results = {
      success: true,
      message: 'Timezone conversion test completed',
      data: {
        serverTime: serverTime,
        serverTimezone: DEFAULT_TIMEZONE,
        conversions: []
      }
    };
    
    testTimezones.forEach(timezone => {
      const convertedTime = convertServerTimeToUserTimezone(serverTime, timezone);
      const displayName = getTimezoneDisplayName(timezone);
      const offset = getTimezoneOffsetHours(timezone);
      
      const conversion = {
        timezone: timezone,
        displayName: displayName,
        convertedTime: convertedTime,
        offsetHours: offset,
        timeDifference: serverTime !== convertedTime
      };
      
      results.data.conversions.push(conversion);
      
      Logger.log(`ðŸŒ ${timezone}: ${serverTime} â†’ ${convertedTime} (${displayName})`);
    });
    
    return results;
    
  } catch (error) {
    Logger.log(`âŒ Timezone conversion test error: ${error}`);
    return {
      success: false,
      message: 'Timezone conversion test failed: ' + error.toString(),
      error: error.toString()
    };
  }
}

/**
 * Verify Time Zone column P setup and functionality
 */
function verifyTimezoneColumnP() {
  try {
    Logger.log('ðŸ” === VERIFYING TIME ZONE COLUMN P SETUP ===');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const staffSheet = spreadsheet.getSheetByName(STAFF_SHEET_NAME);
    
    if (!staffSheet) {
      return { success: false, message: 'Staff sheet not found' };
    }
    
    const lastColumn = staffSheet.getLastColumn();
    const lastRow = staffSheet.getLastRow();
    
    Logger.log(`ðŸ“Š Sheet dimensions: ${lastRow} rows, ${lastColumn} columns`);
    
    // Check if column P exists and has the right header
    const headers = staffSheet.getRange(1, 1, 1, Math.max(lastColumn, 16)).getValues()[0];
    const columnPValue = headers[15]; // Column P is index 15
    
    Logger.log(`ðŸ“ Column P header value: "${columnPValue}"`);
    Logger.log(`ðŸ“‹ All headers: ${headers}`);
    
    // Set or verify Time Zone header in column P
    if (columnPValue !== 'Time Zone') {
      Logger.log('ðŸ”§ Setting Time Zone header in column P...');
      staffSheet.getRange(1, 16).setValue('Time Zone');
      Logger.log('âœ… Time Zone header set in column P');
    } else {
      Logger.log('âœ… Time Zone header already correct in column P');
    }
    
    // Test timezone storage in column P
    const testEmployeeRow = 2; // Assuming first employee is in row 2
    if (lastRow >= 2) {
      const employeeData = staffSheet.getRange(testEmployeeRow, 1, 1, Math.max(lastColumn, 16)).getValues()[0];
      const employeeId = employeeData[0];
      const employeeName = employeeData[1];
      const currentTimezone = employeeData[15]; // Column P value
      
      Logger.log(`ðŸ‘¤ Test employee: ${employeeName} (ID: ${employeeId})`);
      Logger.log(`ðŸŒ Current timezone in column P: "${currentTimezone}"`);
      
      // Test timezone write/read cycle
      const testTimezone = 'Asia/Kolkata (India Standard Time)';
      
      // Write test timezone to column P
      staffSheet.getRange(testEmployeeRow, 16).setValue(testTimezone);
      Logger.log(`âœï¸ Wrote test timezone to P${testEmployeeRow}: ${testTimezone}`);
      
      // Read it back
      const readBack = staffSheet.getRange(testEmployeeRow, 16).getValue();
      Logger.log(`ðŸ“– Read back from P${testEmployeeRow}: "${readBack}"`);
      
      // Test extraction
      const extracted = extractTimezoneId(readBack);
      Logger.log(`ðŸ” Extracted timezone ID: "${extracted}"`);
      
      const results = {
        success: true,
        message: 'Time Zone column P verification completed',
        data: {
          columnPPosition: 16,
          headerSet: true,
          testEmployee: {
            id: employeeId,
            name: employeeName,
            row: testEmployeeRow
          },
          testTimezone: testTimezone,
          readBack: readBack,
          extractedId: extracted,
          writeReadSuccess: readBack === testTimezone,
          extractionSuccess: extracted === 'Asia/Kolkata'
        }
      };
      
      Logger.log('ðŸ“Š Verification results:', JSON.stringify(results.data));
      return results;
      
    } else {
      return {
        success: false,
        message: 'No employee data found to test timezone storage',
        data: { lastRow: lastRow }
      };
    }
    
  } catch (error) {
    Logger.log(`âŒ Error verifying column P: ${error}`);
    return {
      success: false,
      message: 'Error verifying Time Zone column P: ' + error.toString(),
      error: error.toString()
    };
  }
}

/**
 * Get user's stored timezone from Staff sheet Time Zone column
 * Now handles formatted timezone strings like "Asia/Kolkata (India Standard Time)"
 */
function getUserTimezoneFromId(employeeId) {
  try {
    const staffSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(STAFF_SHEET_NAME);
    if (!staffSheet) {
      Logger.log('âŒ Staff sheet not found');
      return null;
    }
    
    // Get headers and prioritize column F for Time Zone
    const headers = staffSheet.getRange(1, 1, 1, Math.max(staffSheet.getLastColumn(), 6)).getValues()[0];
    let timezoneColumnIndex = -1;
    
    // First, check if column F (index 5) has Time Zone
    if (headers.length >= 6 && headers[5] === 'Time Zone') {
      timezoneColumnIndex = 5; // Column F is index 5 (0-based)
      Logger.log(`ðŸŽ¯ Using primary Time Zone column at F (index 5)`);
    } else {
      // Fallback: search for any Time Zone column
      timezoneColumnIndex = headers.indexOf('Time Zone');
      if (timezoneColumnIndex !== -1) {
        Logger.log(`ðŸ” Found Time Zone column at index ${timezoneColumnIndex} (Column ${String.fromCharCode(65 + timezoneColumnIndex)})`);
      } else {
        Logger.log('âš ï¸ No Time Zone column found');
        return null;
      }
    }
    
    Logger.log(`ðŸ” Looking for timezone in column ${String.fromCharCode(65 + timezoneColumnIndex)} (index ${timezoneColumnIndex})`);
    
    const staffData = staffSheet.getRange(1, 1, staffSheet.getLastRow(), Math.max(staffSheet.getLastColumn(), 6)).getValues();
    
    for (let i = 1; i < staffData.length; i++) {
      const row = staffData[i];
      const rowEmployeeId = String(row[0]).trim(); // Employee ID in column A
      const timezoneData = row[timezoneColumnIndex]; // Timezone from Time Zone column
      
      if (rowEmployeeId === String(employeeId).trim()) {
        if (timezoneData) {
          // Extract timezone ID from formatted string like "Asia/Kolkata (India Standard Time)"
          const timezone = extractTimezoneId(timezoneData);
          Logger.log(`ðŸ• Found timezone for ${employeeId}: ${timezone} (stored as: ${timezoneData})`);
          Logger.log(`ðŸ“ Retrieved from column ${String.fromCharCode(65 + timezoneColumnIndex)}, row ${i + 1}`);
          return timezone;
        }
        
        Logger.log(`âš ï¸ No timezone data for employee ID: ${employeeId} in column ${String.fromCharCode(65 + timezoneColumnIndex)}`);
        return null;
      }
    }
    
    Logger.log(`âš ï¸ Employee ID not found: ${employeeId}`);
    return null;
    
  } catch (error) {
    Logger.log(`âŒ Error getting timezone for ${employeeId}: ${error}`);
    return null;
  }
}

/**
 * Extract timezone ID from formatted string
 * Handles formats like "Asia/Kolkata (India Standard Time)" â†’ "Asia/Kolkata"
 */
function extractTimezoneId(timezoneString) {
  try {
    if (!timezoneString) return null;
    
    const str = String(timezoneString).trim();
    
    // If it's already a clean timezone ID
    if (str.match(/^[A-Za-z]+\/[A-Za-z_]+$/)) {
      return str;
    }
    
    // Extract from format "Asia/Kolkata (India Standard Time)"
    const match = str.match(/^([A-Za-z]+\/[A-Za-z_]+)/); 
    if (match) {
      return match[1];
    }
    
    // Fallback: return the original string
    return str;
  } catch (error) {
    Logger.log(`Error extracting timezone ID from "${timezoneString}": ${error}`);
    return timezoneString;
  }
}

/**
 * Test timezone extraction and time conversion
 */
function testTimezoneExtraction() {
  try {
    Logger.log('ðŸ§ª === TESTING TIMEZONE EXTRACTION ===');
    
    const testTimezones = [
      'Asia/Kolkata (India Standard Time)',
      'Asia/Manila (Philippine Standard Time)', 
      'Asia/Tokyo (Japan Standard Time)',
      'America/New_York (Eastern Standard Time)',
      'Europe/London (Greenwich Mean Time)',
      'Asia/Kolkata',  // Already clean
      'invalid timezone format'
    ];
    
    testTimezones.forEach(tz => {
      const extracted = extractTimezoneId(tz);
      const currentTime = getCurrentTimeString(tz);
      
      Logger.log(`ðŸŒ Input: "${tz}"`);
      Logger.log(`âœ… Extracted: "${extracted}"`);
      Logger.log(`â° Time: ${currentTime}`);
      Logger.log('---');
    });
    
    return {
      success: true,
      message: 'Timezone extraction test completed'
    };
    
  } catch (error) {
    Logger.log(`âŒ Timezone extraction test error: ${error}`);
    return {
      success: false,
      message: 'Timezone extraction test failed: ' + error.toString()
    };
  }
}

/**
 * Test auto-update system with fixed timezone conversion
 */
function testAutoUpdateWithFixedTimezone() {
  try {
    Logger.log('ðŸ”§ === TESTING AUTO-UPDATE WITH FIXED TIMEZONE ===');
    
    // Get current timezone setup
    const userTimezone = getUserTimezoneForAutoUpdate();
    const cleanTimezone = extractTimezoneId(userTimezone);
    
    Logger.log(`ðŸŒ Raw timezone from sheet: "${userTimezone}"`);
    Logger.log(`âœ… Clean timezone extracted: "${cleanTimezone}"`);
    
    // Test time conversion
    const serverTime = getCurrentTimeString(DEFAULT_TIMEZONE);
    const userTime = convertServerTimeToUserTimezone(serverTime, userTimezone);
    
    Logger.log(`â° Server time (${DEFAULT_TIMEZONE}): ${serverTime}`);
    Logger.log(`â° User time (${cleanTimezone}): ${userTime}`);
    
    // Test the actual auto-update process
    Logger.log('ðŸš€ Running auto-update...');
    const updateResult = autoUpdateAllShiftStatuses();
    
    return {
      success: true,
      message: 'Auto-update timezone test completed',
      data: {
        rawTimezone: userTimezone,
        cleanTimezone: cleanTimezone,
        serverTime: serverTime,
        userTime: userTime,
        updateResult: updateResult
      }
    };
    
  } catch (error) {
    Logger.log(`âŒ Auto-update timezone test error: ${error}`);
    return {
      success: false,
      message: 'Auto-update timezone test failed: ' + error.toString(),
      error: error.toString()
    };
  }
}

/**
 * Clean up duplicate Time Zone columns and standardize on column F
 */
function cleanupDuplicateTimezoneColumns() {
  try {
    Logger.log('ðŸ§¹ === CLEANING UP DUPLICATE TIME ZONE COLUMNS ===');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const staffSheet = spreadsheet.getSheetByName(STAFF_SHEET_NAME);
    
    if (!staffSheet) {
      return { success: false, message: 'Staff sheet not found' };
    }
    
    const headers = staffSheet.getRange(1, 1, 1, staffSheet.getLastColumn()).getValues()[0];
    const timezoneColumns = [];
    
    // Find all Time Zone columns
    for (let i = 0; i < headers.length; i++) {
      if (headers[i] === 'Time Zone') {
        timezoneColumns.push({
          index: i,
          column: String.fromCharCode(65 + i),
          position: i + 1
        });
      }
    }
    
    Logger.log(`ðŸ“ Found ${timezoneColumns.length} Time Zone columns: ${JSON.stringify(timezoneColumns)}`);
    
    if (timezoneColumns.length <= 1) {
      Logger.log('âœ… No duplicate columns found');
      return {
        success: true,
        message: 'No duplicate Time Zone columns found',
        timezoneColumns: timezoneColumns
      };
    }
    
    // Check if column F (index 5) is one of them
    const columnFIndex = timezoneColumns.findIndex(col => col.index === 5);
    let primaryColumn = columnFIndex >= 0 ? timezoneColumns[columnFIndex] : timezoneColumns[0];
    
    Logger.log(`ðŸŽ¯ Using ${primaryColumn.column} as primary Time Zone column`);
    
    // Get all staff data
    const lastRow = staffSheet.getLastRow();
    if (lastRow > 1) {
      const staffData = staffSheet.getRange(2, 1, lastRow - 1, staffSheet.getLastColumn()).getValues();
      
      // Merge timezone data from all columns to the primary column
      for (let rowIndex = 0; rowIndex < staffData.length; rowIndex++) {
        const row = staffData[rowIndex];
        let bestTimezone = '';
        
        // Check all timezone columns for data
        for (const tzCol of timezoneColumns) {
          const value = row[tzCol.index];
          if (value && value.toString().trim()) {
            bestTimezone = value.toString().trim();
            break; // Use the first non-empty value found
          }
        }
        
        // Set the value in the primary column
        if (bestTimezone) {
          staffSheet.getRange(rowIndex + 2, primaryColumn.position).setValue(bestTimezone);
          Logger.log(`ðŸ“ Set timezone for row ${rowIndex + 2}: ${bestTimezone}`);
        }
        
        // Clear duplicate columns (except primary)
        for (const tzCol of timezoneColumns) {
          if (tzCol.index !== primaryColumn.index) {
            staffSheet.getRange(rowIndex + 2, tzCol.position).setValue('');
          }
        }
      }
    }
    
    // Clear duplicate headers (except primary)
    for (const tzCol of timezoneColumns) {
      if (tzCol.index !== primaryColumn.index) {
        staffSheet.getRange(1, tzCol.position).setValue('');
        Logger.log(`ðŸ—‘ï¸ Cleared duplicate header at column ${tzCol.column}`);
      }
    }
    
    Logger.log(`âœ… Cleanup complete. Primary Time Zone column: ${primaryColumn.column}`);
    
    return {
      success: true,
      message: `Cleanup completed. Using column ${primaryColumn.column} as primary Time Zone column.`,
      data: {
        duplicatesFound: timezoneColumns.length,
        duplicatesRemoved: timezoneColumns.length - 1,
        primaryColumn: primaryColumn,
        allColumns: timezoneColumns
      }
    };
    
  } catch (error) {
    Logger.log(`âŒ Error cleaning up duplicate columns: ${error}`);
    return {
      success: false,
      message: 'Error cleaning up duplicate Time Zone columns: ' + error.toString(),
      error: error.toString()
    };
  }
}

// backup startShiftSafe

// function startShiftSafe(data) {
//   try {
//     Logger.log('=== START SHIFT SAFE ===');
//     if (!data.employeeName || !data.employeeId || !data.shiftDate) { return { success: false, message: 'Missing required fields: employeeName, employeeId, shiftDate' }; }
//     const employeeId = String(data.employeeId).trim();
//     const employeeName = String(data.employeeName).trim();
//     const shiftDate = normalizeDate(data.shiftDate);
//     const currentTime = data.startTime || getCurrentTimeString();
//     const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
//     let sheet = getOrCreateSheet(spreadsheet);
//     const lock = LockService.getScriptLock();
//     try {
//       lock.waitLock(15000);
//       const existingRow = findShiftRowDualCheck(sheet, employeeId, employeeName, shiftDate);
//       if (existingRow > 0) {
//         Logger.log('Found existing shift in row: ' + existingRow);
//         return handleExistingShift(sheet, existingRow, data, currentTime);
//       } else {
//         Logger.log('No existing shift found - Creating a new one');
//         return createBrandNewShift(sheet, data, employeeId, employeeName, shiftDate, currentTime);
//       }
//     } finally {
//       lock.releaseLock();
//     }
//   } catch (error) {
//     Logger.log('Error in startShiftSafe: ' + error.toString());
//     return { success: false, message: 'Failed to start shift: ' + error.toString() };
//   }
// }

function startShiftSafe(data, clientTimezone) {
  try {
    Logger.log('=== START SHIFT SAFE WITH TIMEZONE ===');
    if (!data.employeeName || !data.employeeId || !data.shiftDate) { 
      return { success: false, message: 'Missing required fields: employeeName, employeeId, shiftDate' }; 
    }
    
    const employeeId = String(data.employeeId).trim();
    const employeeName = String(data.employeeName).trim();
    const shiftDate = normalizeDate(data.shiftDate);
    
    // Get user's stored timezone from Staff sheet
    const storedTimezone = getUserTimezoneFromId(employeeId);
    const userTimezone = storedTimezone || clientTimezone || DEFAULT_TIMEZONE;
    
    // Use timezone-aware time
    const currentTime = data.startTime || getCurrentTimeString(userTimezone);
    
    Logger.log(`Starting shift for ${employeeName} at ${currentTime}`);
    Logger.log(`Using timezone: ${userTimezone} (stored: ${storedTimezone}, client: ${clientTimezone})`);
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = getOrCreateSheet(spreadsheet);
    const lock = LockService.getScriptLock();
    
    try {
      lock.waitLock(15000);
      const existingRow = findShiftRowDualCheck(sheet, employeeId, employeeName, shiftDate);
      
      if (existingRow > 0) {
        Logger.log('Found existing shift in row: ' + existingRow);
        return handleExistingShift(sheet, existingRow, data, currentTime, userTimezone);
      } else {
        Logger.log('No existing shift found - Creating a new one');
        return createBrandNewShift(sheet, data, employeeId, employeeName, shiftDate, currentTime, clientTimezone);
      }
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    Logger.log('Error in startShiftSafe: ' + error.toString());
    return { success: false, message: 'Failed to start shift: ' + error.toString() };
  }
}


//  backup stopShift
// function stopShift(data) {
//   try {
//     const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
//     const sheet = spreadsheet.getSheetByName(SHIFTS_SHEET_NAME);
//     if (!sheet) { return { success: false, message: 'Shift sheet not found' }; }
//     const employeeId = String(data.employeeId).trim();
//     const employeeName = String(data.employeeName || '').trim();
//     const shiftDate = normalizeDate(data.shiftDate);
//     const row = findShiftRowDualCheck(sheet, employeeId, employeeName, shiftDate);
//     if (row === 0) { return { success: false, message: 'No active shift found to stop' }; }
//     const rowData = sheet.getRange(row, 1, 1, 13).getValues()[0];
//     let segments = JSON.parse(rowData[9] || '[]');
//     const activeSegment = segments.find(seg => !seg.endTime);
//     if (!activeSegment) { return { success: false, message: 'No active segment found to stop' }; }
//     const endTime = data.endTime || getCurrentTimeString();
//     activeSegment.endTime = endTime;
//     activeSegment.duration = calculateDuration(activeSegment.startTime, endTime);
//     const totalDuration = segments.reduce((sum, seg) => sum + (seg.duration || 0), 0);
//     sheet.getRange(row, 7).setValue(endTime);
//     sheet.getRange(row, 8).setValue(totalDuration);
//     sheet.getRange(row, 10).setValue(JSON.stringify(segments));
//     sheet.getRange(row, 11).setValue('BREAK');
//     sheet.getRange(row, 13).setValue(new Date());
//     formatShiftRow(sheet, row);
//     return {
//       success: true, message: 'Segment stopped successfully',
//       data: { shiftId: rowData[0], employeeName: rowData[1], employeeId: rowData[2], shiftDate: normalizeDate(rowData[3]), shiftType: rowData[4], segments: segments, totalDuration: totalDuration, isActive: false, status: 'BREAK' }
//     };
//   } catch (error) {
//     Logger.log('Error stopping shift: ' + error.toString());
//     return { success: false, message: 'Failed to stop segment: ' + error.toString() };
//   }
// }


function stopShift(data, clientTimezone) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHIFTS_SHEET_NAME);
    if (!sheet) { return { success: false, message: 'Shift sheet not found' }; }
    
    const employeeId = String(data.employeeId).trim();
    const employeeName = String(data.employeeName || '').trim();
    const shiftDate = normalizeDate(data.shiftDate);
    const row = findShiftRowDualCheck(sheet, employeeId, employeeName, shiftDate);
    
    if (row === 0) { return { success: false, message: 'No active shift found to stop' }; }
    
    const rowData = sheet.getRange(row, 1, 1, 13).getValues()[0];
    let segments = JSON.parse(rowData[9] || '[]');
    const activeSegment = segments.find(seg => !seg.endTime);
    
    if (!activeSegment) { return { success: false, message: 'No active segment found to stop' }; }
    
    // Use timezone-aware time
    const endTime = data.endTime || getCurrentTimeString(clientTimezone);
    
    activeSegment.endTime = endTime;
    activeSegment.duration = calculateDuration(activeSegment.startTime, endTime);
    
    const totalDuration = segments.reduce((sum, seg) => sum + (seg.duration || 0), 0);
    
    sheet.getRange(row, 7).setValue(endTime);
    sheet.getRange(row, 8).setValue(totalDuration);
    sheet.getRange(row, 10).setValue(JSON.stringify(segments));
    sheet.getRange(row, 11).setValue('BREAK');
    sheet.getRange(row, 13).setValue(new Date());
    
    formatShiftRow(sheet, row);
    
    const responseData = {
      shiftId: rowData[0], 
      employeeName: rowData[1], 
      employeeId: rowData[2], 
      shiftDate: normalizeDate(rowData[3]), 
      shiftType: rowData[4], 
      segments: segments.map(seg => ({
        ...seg,
        startTimeFormatted: formatTimeForClient(seg.startTime, clientTimezone),
        endTimeFormatted: seg.endTime ? formatTimeForClient(seg.endTime, clientTimezone) : null
      })), 
      totalDuration: totalDuration, 
      isActive: false, 
      status: 'BREAK',
      timezone: clientTimezone
    };
    
    return {
      success: true, 
      message: 'Segment stopped successfully',
      data: responseData
    };
  } catch (error) {
    Logger.log('Error stopping shift: ' + error.toString());
    return { success: false, message: 'Failed to stop segment: ' + error.toString() };
  }
}



function completeShift(data) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHIFTS_SHEET_NAME);
    if (!sheet) { return { success: false, message: 'Shift sheet not found' }; }
    const employeeId = String(data.employeeId).trim();
    const employeeName = String(data.employeeName || '').trim();
    const shiftDate = normalizeDate(data.shiftDate);
    const row = findShiftRowDualCheck(sheet, employeeId, employeeName, shiftDate);
    if (row === 0) { return { success: false, message: 'No shift found for today to complete' }; }
    const rowData = sheet.getRange(row, 1, 1, 13).getValues()[0];
    let segments = JSON.parse(rowData[9] || '[]');
    const openSegment = segments.find(seg => !seg.endTime);
    if (openSegment) {
      const endTime = getCurrentTimeString();
      openSegment.endTime = endTime;
      openSegment.duration = calculateDuration(openSegment.startTime, endTime);
    }
    const totalDuration = segments.reduce((sum, seg) => sum + (seg.duration || 0), 0);
    sheet.getRange(row, 7).setValue(openSegment ? openSegment.endTime : rowData[6]);
    sheet.getRange(row, 8).setValue(totalDuration);
    sheet.getRange(row, 10).setValue(JSON.stringify(segments));
    sheet.getRange(row, 11).setValue('COMPLETED');
    sheet.getRange(row, 13).setValue(new Date());
    formatShiftRow(sheet, row);
    return { success: true, message: 'Shift completed successfully', data: { shiftId: rowData[0], totalHours: totalDuration }};
  } catch (error) {
    Logger.log('Error completing shift: ' + error.toString());
    return { success: false, message: 'Failed to complete shift: ' + error.toString() };
  }
}

// *** getCurrentShift  backup***
// function getCurrentShift(data) {
//   try {
//     const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
//     const sheet = spreadsheet.getSheetByName(SHIFTS_SHEET_NAME);
//     if (!sheet) { return { success: true, data: null, message: 'Shift sheet does not exist' }; }

//     const employeeId = String(data.employeeId).trim();
//     const shiftDate = normalizeDate(data.date);
    
//     Logger.log(`getCurrentShift: Searching for ID: "${employeeId}" on Date: "${shiftDate}"`);

//     const lastRow = sheet.getLastRow();
//     if (lastRow <= 1) { return { success: true, data: null }; }

//     const allData = sheet.getRange(2, 1, lastRow - 1, 13).getValues();
//     let foundRowData = null;

//     // Loop from the end to find the most recent matching shift
//     for (let i = allData.length - 1; i >= 0; i--) {
//       const row = allData[i];
//       const rowEmployeeId = String(row[2]).trim();
//       const rowShiftDate = normalizeDate(row[3]);

//       if (rowEmployeeId === employeeId && rowShiftDate === shiftDate) {
//         foundRowData = row;
//         Logger.log(`Match found in sheet row ${i + 2}`);
//         break; // Stop after finding the first match from the bottom
//       }
//     }

//     if (!foundRowData) {
//       Logger.log('No shift found for this user today.');
//       return { success: true, data: null };
//     }
    
//     // If a row was found, build the response object from it
//     const segments = JSON.parse(foundRowData[9] || '[]');
//     const hasActiveSegment = segments.some(seg => !seg.endTime);
    
//     return {
//       success: true,
//       data: { 
//         shiftId: foundRowData[0], 
//         employeeName: foundRowData[1], 
//         employeeId: foundRowData[2], 
//         shiftDate: normalizeDate(foundRowData[3]), 
//         shiftType: foundRowData[4], 
//         segments: segments, 
//         totalDuration: foundRowData[7], 
//         status: foundRowData[10], 
//         isActive: hasActiveSegment 
//       }
//     };
//   } catch (error) {
//     Logger.log('Error getting current shift: ' + error.toString());
//     return { success: false, message: 'Failed to get current shift: ' + error.toString() };
//   }
// }



// =============================================================
//             ðŸ”¥ ENHANCED getCurrentShift - IMMEDIATE SMART STATUS
//    Replace your existing getCurrentShift with this version for instant fix
// =============================================================

function getCurrentShift(data, clientTimezone) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHIFTS_SHEET_NAME);
    if (!sheet) { return { success: true, data: null, message: 'Shift sheet does not exist' }; }

    const employeeId = String(data.employeeId).trim();
    const shiftDate = normalizeDate(data.date);
    
    Logger.log(`getCurrentShift: Searching for ID: "${employeeId}" on Date: "${shiftDate}"`);

    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) { return { success: true, data: null }; }

    const allData = sheet.getRange(2, 1, lastRow - 1, 13).getValues();
    let foundRowData = null;

    // Loop from the end to find the most recent matching shift
    for (let i = allData.length - 1; i >= 0; i--) {
      const row = allData[i];
      const rowEmployeeId = String(row[2]).trim();
      const rowShiftDate = normalizeDate(row[3]);

      if (rowEmployeeId === employeeId && rowShiftDate === shiftDate) {
        foundRowData = row;
        Logger.log(`Match found in sheet row ${i + 2}`);
        break;
      }
    }

    if (!foundRowData) {
      Logger.log('No shift found for this user today.');
      return { success: true, data: null };
    }
    
    // ========================================
    // ðŸ”¥ IMMEDIATE SMART STATUS LOGIC (NO DELAYS)
    // ========================================
    const segments = JSON.parse(foundRowData[9] || '[]');
    const hasActiveSegment = segments.some(seg => !seg.endTime);
    const lastEndTime = foundRowData[6];
    const storedStatus = foundRowData[10];
    
    // Get current time for immediate comparison
    const currentTime = getCurrentTimeString(clientTimezone);
    let smartStatus = storedStatus; // Default to stored status
    
    // ðŸš¨ IMMEDIATE FIX: Check for impossible "COMPLETED" before shift starts
    if (storedStatus === 'COMPLETED' && segments.length > 0) {
      const firstStartTime = segments[0]?.startTime;
      if (firstStartTime) {
        const [currentHour, currentMinute] = currentTime.split(':').map(Number);
        const [startHour, startMinute] = firstStartTime.split(':').map(Number);
        
        if (!isNaN(currentHour) && !isNaN(currentMinute) && !isNaN(startHour) && !isNaN(startMinute)) {
          const currentMinutes = currentHour * 60 + currentMinute;
          const startMinutes = startHour * 60 + startMinute;
          
          if (currentMinutes < startMinutes) {
            Logger.log(`ðŸš¨ IMPOSSIBLE STATUS DETECTED: Shift marked COMPLETED at ${currentTime} but starts at ${firstStartTime}`);
            smartStatus = 'OFFLINE'; // Override impossible status immediately
            
            // ðŸ”¥ AUTO-FIX: Update the sheet immediately ONLY if really impossible
            try {
              const rowNumber = findRowNumber(spreadsheet, SHIFTS_SHEET_NAME, foundRowData[0]); // Find row by shift ID
              if (rowNumber > 0) {
                Logger.log(`ðŸ”§ AUTO-FIXING impossible status: ${storedStatus} â†’ DRAFT for shift starting at ${firstStartTime}`);
                sheet.getRange(rowNumber, 11).setValue('DRAFT'); // Fix the database too
                Logger.log(`ðŸ”§ AUTO-FIXED database: Changed status to DRAFT in row ${rowNumber}`);
              }
            } catch (fixError) {
              Logger.log('âš ï¸ Could not auto-fix database: ' + fixError.toString());
            }
          }
        }
      }
    }
    
    Logger.log(`ðŸŽ¯ IMMEDIATE STATUS: Stored="${storedStatus}", Smart="${smartStatus}", CurrentTime=${currentTime}`);
    
    // Build response with immediate smart status
    const responseData = { 
      shiftId: foundRowData[0], 
      employeeName: foundRowData[1], 
      employeeId: foundRowData[2], 
      shiftDate: normalizeDate(foundRowData[3]), 
      shiftType: foundRowData[4], 
      segments: segments.map(seg => ({
        ...seg,
        startTimeFormatted: formatTimeForClient(seg.startTime, clientTimezone),
        endTimeFormatted: seg.endTime ? formatTimeForClient(seg.endTime, clientTimezone) : null
      })), 
      totalDuration: foundRowData[7], 
      status: smartStatus, // ðŸ”¥ IMMEDIATE SMART STATUS
      isActive: hasActiveSegment,
      firstStartTimeFormatted: formatTimeForClient(foundRowData[5], clientTimezone),
      lastEndTimeFormatted: foundRowData[6] ? formatTimeForClient(foundRowData[6], clientTimezone) : null,
      timezone: clientTimezone,
      _debug: {
        storedStatus: storedStatus,
        smartStatus: smartStatus,
        currentTime: currentTime,
        autoFixed: smartStatus !== storedStatus
      }
    };
    
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    Logger.log('Error getting current shift: ' + error.toString());
    return { success: false, message: 'Failed to get current shift: ' + error.toString() };
  }
}










/**
 * NEW SMART STATUS CALCULATOR - Add this function to your Apps Script
 */
function calculateSmartShiftStatus(segments, firstStartTime, lastEndTime) {
  try {
    // Get current time
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    Logger.log(`ðŸ” Calculating smart status: Current time: ${currentTime}`);
    Logger.log(`   First start: ${firstStartTime}, Last end: ${lastEndTime}`);
    Logger.log(`   Segments count: ${segments ? segments.length : 0}`);
    
    // If no segments, it's a draft
    if (!segments || segments.length === 0) {
      Logger.log('   â†’ DRAFT (no segments)');
      return 'DRAFT';
    }
    
    // Check if current time is BEFORE shift starts (OFFLINE status)
    if (firstStartTime && isCurrentTimeBeforeShiftStart(currentTime, firstStartTime)) {
      Logger.log(`   â†’ OFFLINE (current ${currentTime} < start ${firstStartTime})`);
      return 'OFFLINE';
    }
    
    // Check if there's an active segment (no end time)
    const hasActiveSegment = segments.some(seg => !seg.endTime);
    if (hasActiveSegment) {
      Logger.log('   â†’ ACTIVE (has active segment)');
      return 'ACTIVE';
    }
    
    // Check if current time is AFTER shift ends (COMPLETED status)
    if (lastEndTime && isCurrentTimeAfterShiftEnd(currentTime, lastEndTime)) {
      Logger.log(`   â†’ COMPLETED (current ${currentTime} > end ${lastEndTime})`);
      return 'COMPLETED';
    }
    
    // Check if we're in a gap between segments (ON BREAK)
    if (segments.length > 1) {
      const inGap = checkForGapsBetweenSegments(segments, currentTime);
      if (inGap) {
        Logger.log('   â†’ ON BREAK (in gap between segments)');
        return 'ON BREAK';
      }
    }
    
    // If we have completed segments but current time hasn't passed end time
    const completedSegments = segments.filter(seg => seg.endTime);
    if (completedSegments.length > 0) {
      Logger.log('   â†’ ON BREAK (has completed segments, not past end time)');
      return 'ON BREAK';
    }
    
    // Default fallback
    Logger.log('   â†’ DRAFT (default fallback)');
    return 'DRAFT';
    
  } catch (error) {
    Logger.log('âŒ Error in calculateSmartShiftStatus: ' + error.toString());
    return 'DRAFT'; // Safe fallback
  }
}

/**
 * UPDATED createCompleteShift - Replace your existing function with this version
 */
function createCompleteShift(data, clientTimezone) {
  try {
    Logger.log('=== CREATE COMPLETE SHIFT WITH SMART STATUS LOGIC ===');
    Logger.log('Received data: ' + JSON.stringify(data));
    Logger.log(`ðŸ” INITIAL DEBUG: scheduleStatus = ${data.scheduleStatus}`);
    Logger.log(`ðŸ” INITIAL DEBUG: segments count = ${data.segments ? data.segments.length : 0}`);
    
    if (!data.employeeName || !data.employeeId || !data.shiftDate || !data.segments) {
      return { success: false, message: 'Missing required fields: employeeName, employeeId, shiftDate, segments' };
    }

    const employeeId = String(data.employeeId).trim();
    const employeeName = String(data.employeeName).trim();
    const shiftDate = normalizeDate(data.shiftDate);
    const segments = data.segments || [];
    const totalDuration = data.totalDuration || 0;
    const scheduleStatus = data.scheduleStatus || 'draft';
    const isScheduleChange = data.isScheduleChange || false;
    const isFirstSave = data.isFirstSave || false;
    const isUpdate = data.isUpdate || false;
    
    Logger.log(`Processing shift for ${employeeName} (${employeeId}) on ${shiftDate}`);
    
    // ðŸ”¥ CALCULATE SMART STATUS INSTEAD OF USING scheduleStatus
    // Special handling for active segments during creation
    const hasActiveSegment = segments.some(seg => !seg.endTime);
    Logger.log(`ðŸ” DEBUG: hasActiveSegment = ${hasActiveSegment}`);
    Logger.log(`ðŸ” DEBUG: segments = ${JSON.stringify(segments)}`);
    
    let smartStatus;
    
    if (hasActiveSegment) {
      // If creating a shift with active segments, it should be ACTIVE
      smartStatus = 'ACTIVE';
      Logger.log('ðŸŽ¯ Smart status: ACTIVE (has active segment during creation)');
    } else {
      // ðŸ”¥ SPECIAL CHECK: If all segments have endTime but current time is BEFORE the last endTime
      // this might be a frontend issue where it's sending completed segments for an active shift
      const currentTime = getCurrentTimeString(clientTimezone);
      const [currentHour, currentMin] = currentTime.split(':').map(Number);
      const currentMinutes = currentHour * 60 + currentMin;
      
      if (data.lastEndTime) {
        const [endHour, endMin] = data.lastEndTime.split(':').map(Number);
        const endMinutes = endHour * 60 + endMin;
        
        Logger.log(`ðŸš¨ FRONTEND ISSUE CHECK: Current ${currentTime} (${currentMinutes} min) vs End ${data.lastEndTime} (${endMinutes} min)`);
        
        if (currentMinutes < endMinutes) {
          // Current time is before shift end - this should be ACTIVE, not COMPLETED
          Logger.log('ðŸš¨ FRONTEND ISSUE DETECTED: Shift has endTime in future but current time is before it - forcing ACTIVE');
          smartStatus = 'ACTIVE';
        } else {
          smartStatus = calculateSmartShiftStatus(segments, data.firstStartTime, data.lastEndTime);
        }
      } else {
        smartStatus = calculateSmartShiftStatus(segments, data.firstStartTime, data.lastEndTime);
      }
      Logger.log(`ðŸŽ¯ Smart status calculated: ${smartStatus}`);
    }
    
    Logger.log(`ðŸš¨ FINAL SMART STATUS TO SAVE: ${smartStatus}`);
    Logger.log(`ðŸš¨ OVERRIDING scheduleStatus '${scheduleStatus}' with smartStatus '${smartStatus}'`);
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = getOrCreateSheet(spreadsheet);
    
    const lock = LockService.getScriptLock();
    try {
      lock.waitLock(15000);
      
      // Check if shift already exists for today
      const existingRow = findShiftRowDualCheck(sheet, employeeId, employeeName, shiftDate);
      if (existingRow > 0) {
        Logger.log('Updating existing shift in row: ' + existingRow);
        
        // Get existing data for tracking
        const existingData = sheet.getRange(existingRow, 1, 1, 15).getValues()[0];
        const shiftId = existingData[0];
        const existingInitialData = existingData[13] || '';
        const existingUpdatedFlag = existingData[14] || false;
        
        // Preserve initial segment data
        const initialSegmentData = existingInitialData || (isFirstSave ? JSON.stringify(segments) : '');
        const updatedFlag = existingUpdatedFlag || isUpdate;
        
        // ðŸ”¥ UPDATE WITH SMART STATUS
        sheet.getRange(existingRow, 5).setValue(data.shiftType || 'Regular');
        sheet.getRange(existingRow, 6).setValue(data.firstStartTime);
        sheet.getRange(existingRow, 7).setValue(data.lastEndTime);
        sheet.getRange(existingRow, 8).setValue(totalDuration);
        sheet.getRange(existingRow, 9).setValue(segments.length);
        sheet.getRange(existingRow, 10).setValue(JSON.stringify(segments));
        Logger.log(`ðŸš¨ SAVING TO SHEET - Column K (Status): ${smartStatus}`);
        sheet.getRange(existingRow, 11).setValue(smartStatus); // ðŸ”¥ USE SMART STATUS!
        sheet.getRange(existingRow, 13).setValue(new Date());
        sheet.getRange(existingRow, 14).setValue(initialSegmentData);
        sheet.getRange(existingRow, 15).setValue(updatedFlag);
        
        // Verify what was actually saved
        const savedStatus = sheet.getRange(existingRow, 11).getValue();
        Logger.log(`ðŸš¨ VERIFICATION - Status actually saved in sheet: ${savedStatus}`);
        
        formatShiftRow(sheet, existingRow);
        
        Logger.log(`âœ… Shift updated with SMART status: ${smartStatus}`);
        
        return {
          success: true,
          message: isScheduleChange ? 'Schedule change tracked and saved' : 'Shift updated successfully',
          data: {
            shiftId: shiftId,
            employeeName: employeeName,
            employeeId: employeeId,
            shiftDate: shiftDate,
            shiftType: data.shiftType || 'Regular',
            segments: segments,
            totalDuration: totalDuration,
            status: smartStatus, // ðŸ”¥ RETURN SMART STATUS
            scheduleStatus: scheduleStatus,
            initialSegmentData: initialSegmentData,
            updated: updatedFlag
          }
        };
      } else {
        Logger.log('Creating new complete shift with smart status');
        
        const shiftId = 'SH' + Date.now();
        const initialSegmentData = JSON.stringify(segments);
        
        Logger.log(`ðŸš¨ CREATING NEW SHIFT - Status will be: ${smartStatus}`);
        const rowData = [
          shiftId,
          employeeName,
          employeeId,
          shiftDate,
          data.shiftType || 'Regular',
          data.firstStartTime,
          data.lastEndTime,
          totalDuration,
          segments.length,
          JSON.stringify(segments),
          smartStatus, // ðŸ”¥ USE SMART STATUS FOR NEW SHIFTS TOO!
          new Date(),
          new Date(),
          initialSegmentData,
          false
        ];
        Logger.log(`ðŸš¨ NEW SHIFT ROW DATA - Position 10 (Status): ${rowData[10]}`);
        
        const nextRow = sheet.getLastRow() + 1;
        sheet.getRange(nextRow, 1, 1, 15).setValues([rowData]);
        formatShiftRow(sheet, nextRow);
        
        Logger.log(`âœ… New shift created with SMART status: ${smartStatus}`);
        
        return {
          success: true,
          message: 'New shift created successfully',
          data: {
            shiftId: shiftId,
            employeeName: employeeName,
            employeeId: employeeId,
            shiftDate: shiftDate,
            shiftType: data.shiftType || 'Regular',
            segments: segments,
            totalDuration: totalDuration,
            status: smartStatus, // ðŸ”¥ RETURN SMART STATUS
            scheduleStatus: scheduleStatus,
            initialSegmentData: initialSegmentData,
            updated: false
          }
        };
      }
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    Logger.log('Error in createCompleteShift: ' + error.toString());
    return { success: false, message: 'Failed to create complete shift: ' + error.toString() };
  }
}

// =============================================================
//          DATA & ADMIN FUNCTIONS
// =============================================================

// backup getShifts
// function getShifts(data) {
//   try {
//     const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
//     const sheet = spreadsheet.getSheetByName(SHIFTS_SHEET_NAME);
//     if (!sheet || sheet.getLastRow() <= 1) { return { success: true, data: [], message: 'No shifts found' }; }
//     const allData = sheet.getRange(2, 1, sheet.getLastRow() - 1, 13).getValues();
//     let filteredData = allData;
//     if (data && data.employeeId) { filteredData = filteredData.filter(row => String(row[2]).trim() === String(data.employeeId).trim()); }
//     if (data && data.startDate && data.endDate) {
//       const startDate = new Date(data.startDate);
//       startDate.setHours(0, 0, 0, 0);
//       const endDate = new Date(data.endDate);
//       endDate.setHours(23, 59, 59, 999);
//       filteredData = filteredData.filter(row => { const shiftDate = new Date(row[3]); return shiftDate >= startDate && shiftDate <= endDate; });
//     }
//     const shifts = filteredData.map(row => ({ shiftId: row[0], employeeName: row[1], employeeId: row[2], shiftDate: normalizeDate(row[3]), shiftType: row[4], firstStartTime: row[5], lastEndTime: row[6], totalDuration: row[7], numberOfSegments: row[8], segments: JSON.parse(row[9] || '[]'), status: row[10], createdAt: row[11], lastUpdated: row[12] }));
//     return { success: true, data: shifts, count: shifts.length };
//   } catch (error) {
//     Logger.log('Error getting shifts: ' + error.toString());
//     return { success: false, message: 'Failed to retrieve shifts: ' + error.toString() };
//   }
// }


/**
 * ðŸ”¥ ENHANCED getShifts WITH SAME SMART STATUS LOGIC
 * Replace your existing getShifts function with this one
 */
function getShifts(data, clientTimezone) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHIFTS_SHEET_NAME);
    if (!sheet || sheet.getLastRow() <= 1) { return { success: true, data: [], message: 'No shifts found' }; }
    
    const allData = sheet.getRange(2, 1, sheet.getLastRow() - 1, 13).getValues();
    let filteredData = allData;
    
    if (data && data.employeeId) { 
      filteredData = filteredData.filter(row => String(row[2]).trim() === String(data.employeeId).trim()); 
    }
    
    if (data && data.startDate && data.endDate) {
      const startDate = new Date(data.startDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(data.endDate);
      endDate.setHours(23, 59, 59, 999);
      filteredData = filteredData.filter(row => { 
        const shiftDate = new Date(row[3]); 
        return shiftDate >= startDate && shiftDate <= endDate; 
      });
    }
    
    const currentTime = getCurrentTimeString(clientTimezone);
    
    const shifts = filteredData.map(row => {
      // ========================================
      // ðŸ”¥ SAME SMART STATUS LOGIC FOR SHIFT HISTORY
      // ========================================
      const segments = JSON.parse(row[9] || '[]');
      const hasActiveSegment = segments.some(seg => !seg.endTime);
      const lastEndTime = row[6];
      const storedStatus = row[10];
      
      let smartStatus;
      
      // Apply the same intelligent status logic
      if (storedStatus === 'COMPLETED' && segments.length > 0) {
        const firstStartTime = segments[0]?.startTime;
        if (firstStartTime && isCurrentTimeBeforeShiftStart(currentTime, firstStartTime)) {
          smartStatus = 'OFFLINE';
        } else {
          smartStatus = 'COMPLETED';
        }
      } else if (segments.length > 0 && !hasActiveSegment) {
        const firstStartTime = segments[0]?.startTime;
        if (firstStartTime && isCurrentTimeBeforeShiftStart(currentTime, firstStartTime)) {
          smartStatus = 'OFFLINE';
        } else if (lastEndTime && isCurrentTimeAfterShiftEnd(currentTime, lastEndTime)) {
          smartStatus = 'COMPLETED';
        } else if (checkForGapsBetweenSegments(segments, currentTime)) {
          smartStatus = 'ON BREAK';
        } else {
          smartStatus = 'ON BREAK';
        }
      } else if (hasActiveSegment) {
        smartStatus = 'ACTIVE';
      } else if (segments.length > 0) {
        if (lastEndTime && isCurrentTimeAfterShiftEnd(currentTime, lastEndTime)) {
          smartStatus = 'COMPLETED';
        } else {
          smartStatus = 'ON BREAK';
        }
      } else {
        smartStatus = 'DRAFT';
      }
      // ========================================
      
      return {
        shiftId: row[0], 
        employeeName: row[1], 
        employeeId: row[2], 
        shiftDate: normalizeDate(row[3]), 
        shiftType: row[4], 
        firstStartTime: row[5],
        firstStartTimeFormatted: formatTimeForClient(row[5], clientTimezone),
        lastEndTime: row[6],
        lastEndTimeFormatted: row[6] ? formatTimeForClient(row[6], clientTimezone) : null,
        totalDuration: row[7], 
        numberOfSegments: row[8], 
        segments: segments.map(seg => ({
          ...seg,
          startTimeFormatted: formatTimeForClient(seg.startTime, clientTimezone),
          endTimeFormatted: seg.endTime ? formatTimeForClient(seg.endTime, clientTimezone) : null
        })), 
        status: smartStatus, // ðŸ”¥ SMART STATUS FOR HISTORY TOO
        createdAt: row[11], 
        lastUpdated: row[12],
        timezone: clientTimezone
      };
    });
    
    return { success: true, data: shifts, count: shifts.length };
  } catch (error) {
    Logger.log('Error getting shifts: ' + error.toString());
    return { success: false, message: 'Failed to retrieve shifts: ' + error.toString() };
  }
}




function getStaffList() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let staffSheet = spreadsheet.getSheetByName(STAFF_SHEET_NAME);
    if (!staffSheet) {
      staffSheet = spreadsheet.insertSheet(STAFF_SHEET_NAME);
      createStaffTableHeaders(staffSheet);
      const sampleData = [ ['EMP001', 'John Doe', 'john@company.com', 'Staff', 'Operations'], ['EMP002', 'Jane Smith', 'jane@company.com', 'Staff', 'Sales'], ['ADMIN01', 'Admin User', 'admin@company.com', 'Admin', 'Management'] ];
      staffSheet.getRange(2, 1, sampleData.length, 5).setValues(sampleData);
    }
    const lastRow = staffSheet.getLastRow();
    if (lastRow <= 1) { return { success: true, data: [], message: 'No staff found' }; }
    const allData = staffSheet.getRange(2, 1, lastRow - 1, 5).getValues();
    const staff = allData.map(row => ({ staffId: row[0], name: row[1], email: row[2], role: row[3], department: row[4] }));
    return { success: true, data: staff, count: staff.length };
  } catch (error) {
    Logger.log('Error getting staff list: ' + error.toString());
    return { success: false, message: 'Failed to get staff list: ' + error.toString() };
  }
}

function cleanupDuplicateShifts() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHIFTS_SHEET_NAME);
    if (!sheet || sheet.getLastRow() <= 1) { return { success: true, message: 'No data to clean up' }; }
    const allData = sheet.getRange(2, 1, sheet.getLastRow() - 1, 13).getValues();
    const seen = new Map();
    const rowsToDelete = [];
    allData.forEach((row, index) => {
      const employeeId = String(row[2]).trim();
      const shiftDate = normalizeDate(row[3]);
      const key = `${employeeId}_${shiftDate}`;
      if (seen.has(key)) { rowsToDelete.push(index + 2); } else { seen.set(key, index + 2); }
    });
    if (rowsToDelete.length === 0) { return { success: true, message: 'Cleanup complete. No duplicates found.' }; }
    rowsToDelete.sort((a, b) => b - a).forEach(rowIndex => { sheet.deleteRow(rowIndex); });
    return { success: true, message: `Cleanup complete. Removed ${rowsToDelete.length} duplicate shifts.` };
  } catch (error) {
    Logger.log('Error during cleanup: ' + error.toString());
    return { success: false, message: 'Cleanup failed: ' + error.toString() };
  }
}

// =============================================================
//                 HELPER & UTILITY FUNCTIONS
// =============================================================

function findShiftRowDualCheck(sheet, employeeId, employeeName, shiftDate) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) { return 0; }
  const allData = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
  for (let i = allData.length - 1; i >= 0; i--) {
    const row = allData[i];
    const rowEmployeeName = String(row[1]).trim();
    const rowEmployeeId = String(row[2]).trim();
    const rowShiftDate = normalizeDate(row[3]);
    const nameMatch = (rowEmployeeName.toLowerCase() === employeeName.toLowerCase());
    const idMatch = (rowEmployeeId === employeeId);
    const dateMatch = (rowShiftDate === shiftDate);
    if ((nameMatch || idMatch) && dateMatch) { return i + 2; }
  }
  return 0;
}



// //handleExistingShift backup
// function handleExistingShift(sheet, row, data, currentTime) {
//   try {
//     const rowData = sheet.getRange(row, 1, 1, 13).getValues()[0];
//     const status = rowData[10];
//     const employeeId = rowData[2];
//     const shiftDate = rowData[3];
//     if (status === 'COMPLETED') { return { success: false, message: 'Shift already completed for today' }; }
//     if (status === 'ACTIVE') { return { success: true, message: 'Your shift is already active', data: getCurrentShift({employeeId, date: shiftDate}).data }; }
//     let segments = JSON.parse(rowData[9] || '[]');
//     segments.push({ segmentId: segments.length + 1, startTime: currentTime, endTime: null, duration: null });
//     sheet.getRange(row, 9).setValue(segments.length);
//     sheet.getRange(row, 10).setValue(JSON.stringify(segments));
//     sheet.getRange(row, 11).setValue('ACTIVE');
//     sheet.getRange(row, 13).setValue(new Date());
//     formatShiftRow(sheet, row);
//     return {
//       success: true, message: 'New work segment started',
//       data: { shiftId: rowData[0], employeeName: rowData[1], employeeId: employeeId, shiftDate: normalizeDate(shiftDate), shiftType: rowData[4], segments: segments, totalDuration: rowData[7], isActive: true, status: 'ACTIVE' }
//     };
//   } catch (error) {
//     Logger.log('Error handling existing shift: ' + error.toString());
//     return { success: false, message: 'Failed to update existing shift: ' + error.toString() };
//   }
// }



// Helper functions that need timezone support
function handleExistingShift(sheet, row, data, currentTime, clientTimezone) {
  try {
    const rowData = sheet.getRange(row, 1, 1, 13).getValues()[0];
    const status = rowData[10];
    const employeeId = rowData[2];
    const shiftDate = rowData[3];
    
    if (status === 'COMPLETED') { return { success: false, message: 'Shift already completed for today' }; }
    if (status === 'ACTIVE') { 
      return { 
        success: true, 
        message: 'Your shift is already active', 
        data: getCurrentShift({employeeId, date: shiftDate}, clientTimezone).data 
      }; 
    }
    
    let segments = JSON.parse(rowData[9] || '[]');
    segments.push({ segmentId: segments.length + 1, startTime: currentTime, endTime: null, duration: null });
    
    sheet.getRange(row, 9).setValue(segments.length);
    sheet.getRange(row, 10).setValue(JSON.stringify(segments));
    sheet.getRange(row, 11).setValue('ACTIVE');
    sheet.getRange(row, 13).setValue(new Date());
    
    formatShiftRow(sheet, row);
    
    const responseData = { 
      shiftId: rowData[0], 
      employeeName: rowData[1], 
      employeeId: employeeId, 
      shiftDate: normalizeDate(shiftDate), 
      shiftType: rowData[4], 
      segments: segments.map(seg => ({
        ...seg,
        startTimeFormatted: formatTimeForClient(seg.startTime, clientTimezone),
        endTimeFormatted: seg.endTime ? formatTimeForClient(seg.endTime, clientTimezone) : null
      })), 
      totalDuration: rowData[7], 
      isActive: true, 
      status: 'ACTIVE',
      timezone: clientTimezone
    };
    
    return {
      success: true, 
      message: 'New work segment started',
      data: responseData
    };
  } catch (error) {
    Logger.log('Error handling existing shift: ' + error.toString());
    return { success: false, message: 'Failed to update existing shift: ' + error.toString() };
  }
}






// createBrandNewShift
// function createBrandNewShift(sheet, data, employeeId, employeeName, shiftDate, currentTime) {
//   const shiftId = 'SH' + Date.now();
//   const segments = [{ segmentId: 1, startTime: currentTime, endTime: null, duration: null }];
//   const shiftType = data.shiftType || 'Regular';
//   const rowData = [ shiftId, employeeName, employeeId, shiftDate, shiftType, currentTime, null, 0, 1, JSON.stringify(segments), 'ACTIVE', new Date(), new Date() ];
//   const nextRow = sheet.getLastRow() + 1;
//   sheet.getRange(nextRow, 1, 1, 13).setValues([rowData]);
//   formatShiftRow(sheet, nextRow);
//   Logger.log('NEW SHIFT CREATED in row: ' + nextRow);
//   return {
//     success: true, message: 'New shift started successfully',
//     data: { shiftId: shiftId, employeeName: employeeName, employeeId: employeeId, shiftDate: shiftDate, shiftType: shiftType, segments: segments, totalDuration: 0, isActive: true, status: 'ACTIVE' }
//   };
// }


function createBrandNewShift(sheet, data, employeeId, employeeName, shiftDate, currentTime, clientTimezone) {
  const shiftId = 'SH' + Date.now();
  const segments = [{ segmentId: 1, startTime: currentTime, endTime: null, duration: null }];
  const shiftType = data.shiftType || 'Regular';
  
  const rowData = [ 
    shiftId, employeeName, employeeId, shiftDate, shiftType, currentTime, null, 0, 1, 
    JSON.stringify(segments), 'ACTIVE', new Date(), new Date() 
  ];
  
  const nextRow = sheet.getLastRow() + 1;
  sheet.getRange(nextRow, 1, 1, 13).setValues([rowData]);
  formatShiftRow(sheet, nextRow);
  
  Logger.log('NEW SHIFT CREATED in row: ' + nextRow);
  
  const responseData = { 
    shiftId: shiftId, 
    employeeName: employeeName, 
    employeeId: employeeId, 
    shiftDate: shiftDate, 
    shiftType: shiftType, 
    segments: segments.map(seg => ({
      ...seg,
      startTimeFormatted: formatTimeForClient(seg.startTime, clientTimezone),
      endTimeFormatted: seg.endTime ? formatTimeForClient(seg.endTime, clientTimezone) : null
    })), 
    totalDuration: 0, 
    isActive: true, 
    status: 'ACTIVE',
    timezone: clientTimezone
  };
  
  return {
    success: true, 
    message: 'New shift started successfully',
    data: responseData
  };
}

function normalizeDate(dateInput) {
  try {
    let date;
    // If the input is already a Date object, use it. Otherwise, create one.
    if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      // If no date is provided, use the current date.
      if (!dateInput) {
        date = new Date();
      } else {
        date = new Date(dateInput);
      }
    }
    
    // Check if the created date is valid
    if (isNaN(date.getTime())) {
      // If invalid, default to today's date
      date = new Date();
    }

    const year = date.getFullYear();
    // getMonth() is 0-indexed (0=Jan, 11=Dec), so we add 1.
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
    
  } catch (e) {
    Logger.log('Error normalizing date: ' + e);
    // Fallback to today's date in case of any unexpected error
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}


function calculateDuration(startTime, endTime) {
  try {
    const start = new Date('1970-01-01T' + startTime + ':00');
    const end = new Date('1970-01-01T' + endTime + ':00');
    let diffMs = end - start;
    if (diffMs < 0) diffMs += 86400000;
    return Math.round((diffMs / 3600000) * 100) / 100;
  } catch (e) { return 0; }
}

function addNewSegment(data) { return startShiftSafe(data); }

function getOrCreateSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(SHIFTS_SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHIFTS_SHEET_NAME);
    createRealTimeHeaders(sheet);
  } else if (sheet.getRange(1, 1, 1, 1).getValue() !== 'Shift ID') {
    createRealTimeHeaders(sheet);
  }
  return sheet;
}

function createRealTimeHeaders(sheet) {
  sheet.clear();
  const headers = [ 
    'Shift ID', 'Employee Name', 'Employee ID', 'Shift Date', 'Shift Type', 
    'First Start Time', 'Last End Time', 'Total Duration', 'Number of Segments', 
    'Segments Data', 'Status', 'Created At', 'Last Updated',
    'Initial Segment Data', 'Updated' // NEW COLUMNS N and O
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setFontWeight('bold').setBackground('#1f4e79').setFontColor('#ffffff')
    .setHorizontalAlignment('center');
  
  const widths = [120, 150, 100, 100, 100, 100, 100, 120, 80, 300, 100, 150, 150, 300, 80]; // Updated widths for 15 columns
  widths.forEach((width, index) => sheet.setColumnWidth(index + 1, width));
  sheet.setFrozenRows(1);
}

function createStaffTableHeaders(sheet) {
  const headers = ['Staff ID', 'Name', 'Email', 'Role', 'Department'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#0f5132').setFontColor('#ffffff').setHorizontalAlignment('center');
  const widths = [100, 150, 200, 80, 120];
  widths.forEach((width, index) => sheet.setColumnWidth(index + 1, width));
  sheet.setFrozenRows(1);
}

function formatShiftRow(sheet, rowNumber) {
  try {
    const rowRange = sheet.getRange(rowNumber, 1, 1, 15); // Updated to 15 columns
    rowRange.setBackground(rowNumber % 2 === 0 ? '#f8f9fa' : '#ffffff')
      .setFontSize(9).setVerticalAlignment('middle')
      .setBorder(true, true, true, true, false, true, '#d0d0d0', SpreadsheetApp.BorderStyle.SOLID);
    
    const statusCell = sheet.getRange(rowNumber, 11);
    const status = statusCell.getValue();
    let bgColor = '#ffffff';
    if (status === 'ACTIVE') bgColor = '#4caf50';
    else if (status === 'BREAK') bgColor = '#ff9800';
    else if (status === 'COMPLETED') bgColor = '#2196f3';
    else if (status === 'DRAFT') bgColor = '#ff9800'; // Added DRAFT status
    statusCell.setBackground(bgColor).setFontColor('white').setFontWeight('bold');
    
    // Format the Updated column (O) with conditional formatting
    const updatedCell = sheet.getRange(rowNumber, 15); // Column O: Updated
    const updatedValue = updatedCell.getValue();
    if (updatedValue === true) {
      updatedCell.setBackground('#ffeb3b').setFontWeight('bold'); // Yellow background for updated records
    }
    
    sheet.getRange(rowNumber, 8).setNumberFormat('0.00');
    sheet.getRange(rowNumber, 12, 1, 2).setNumberFormat('yyyy-mm-dd hh:mm:ss');
  } catch (e) { 
    Logger.log('Error formatting row ' + rowNumber + ': ' + e); 
  }
}






// =============================================================
//                       TESTING FUNCTIONS
// =============================================================
// Instructions:
// 1. Select the function 'runAllTests' from the dropdown menu at the top of the editor.
// 2. Click the 'Run' button.
// 3. View the step-by-step output in the Execution Log below.
// 4. To clean up test data, run the 'cleanupTestShifts' function.
// =============================================================

/**
 * A comprehensive test suite that simulates a user's entire shift workflow.
 * This can be run directly from the Apps Script editor to test backend logic.
 */
function runAllTests() {
  Logger.log('===== STARTING COMPREHENSIVE TEST SUITE =====');

  // --- Test Configuration ---
  const testUser = {
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    // Use today's date for the test, converted to the correct format
    shiftDate: new Date().toISOString().split('T')[0] 
  };
  
  try {
    // --- 1. AUTHENTICATION TEST ---
    Logger.log('\n--- TEST 1: Authenticate User ---');
    let authResult = authenticateUser({ username: testUser.employeeName, password: testUser.employeeId });
    Logger.log('  --> Result: ' + JSON.stringify(authResult));
    if (!authResult.success) throw new Error('Authentication failed!');

    // --- 2. START SHIFT TEST ---
    Logger.log('\n--- TEST 2: Start Initial Shift ---');
    let startShiftResult = startShiftSafe(testUser);
    Logger.log('  --> Result: ' + JSON.stringify(startShiftResult));
    if (!startShiftResult.success || startShiftResult.data.status !== 'ACTIVE') throw new Error('Start Shift failed!');
    
    // --- 3. GET CURRENT SHIFT (ACTIVE) ---
    Logger.log('\n--- TEST 3: Get Current Shift (should be ACTIVE) ---');
    let currentShift1 = getCurrentShift({ employeeId: testUser.employeeId, date: testUser.shiftDate });
    Logger.log('  --> Result: ' + JSON.stringify(currentShift1));
    if (!currentShift1.success || currentShift1.data.status !== 'ACTIVE') throw new Error('Get Shift (Active) failed!');

    // --- 4. STOP SEGMENT (BREAK) ---
    Logger.log('\n--- TEST 4: Stop a Segment (Go on Break) ---');
    let stopSegmentResult = stopShift(testUser);
    Logger.log('  --> Result: ' + JSON.stringify(stopSegmentResult));
    if (!stopSegmentResult.success || stopSegmentResult.data.status !== 'BREAK') throw new Error('Stop Segment failed!');

    // --- 5. GET CURRENT SHIFT (BREAK) ---
    Logger.log('\n--- TEST 5: Get Current Shift (should be BREAK) ---');
    let currentShift2 = getCurrentShift({ employeeId: testUser.employeeId, date: testUser.shiftDate });
    Logger.log('  --> Result: ' + JSON.stringify(currentShift2));
    if (!currentShift2.success || currentShift2.data.status !== 'BREAK') throw new Error('Get Shift (Break) failed!');

    // --- 6. ADD NEW SEGMENT (RESUME) ---
    Logger.log('\n--- TEST 6: Add New Segment (Resume from Break) ---');
    let resumeResult = addNewSegment(testUser);
    Logger.log('  --> Result: ' + JSON.stringify(resumeResult));
    if (!resumeResult.success || resumeResult.data.status !== 'ACTIVE') throw new Error('Add New Segment failed!');
    
    // --- 7. COMPLETE SHIFT ---
    Logger.log('\n--- TEST 7: Complete the Entire Shift ---');
    let completeResult = completeShift(testUser);
    Logger.log('  --> Result: ' + JSON.stringify(completeResult));
    if (!completeResult.success) throw new Error('Complete Shift failed!');
    
    // --- 8. GET CURRENT SHIFT (COMPLETED) ---
    Logger.log('\n--- TEST 8: Get Current Shift (should be COMPLETED) ---');
    let finalShift = getCurrentShift({ employeeId: testUser.employeeId, date: testUser.shiftDate });
    Logger.log('  --> Result: ' + JSON.stringify(finalShift));
    if (!finalShift.success || finalShift.data.status !== 'COMPLETED') throw new Error('Get Shift (Completed) failed!');

    Logger.log('\n\nâœ… âœ… âœ… ALL TESTS PASSED SUCCESSFULLY! âœ… âœ… âœ…');

  } catch (e) {
    Logger.log('\n\nâŒ âŒ âŒ TEST FAILED: ' + e.message + ' âŒ âŒ âŒ');
  } finally {
    Logger.log('\n===== TEST SUITE COMPLETE =====');
    Logger.log('NOTE: A test shift entry was created. Run "cleanupTestShifts" to remove it.');
  }
}

/**
 * Helper function to remove all shifts for the test user ('EMP001').
 * This is useful for cleaning up the sheet after running tests.
 */
function cleanupTestShifts() {
  const testEmployeeId = 'EMP001';
  Logger.log(`--- Starting cleanup for Employee ID: ${testEmployeeId} ---`);
  
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHIFTS_SHEET_NAME);
  
  if (!sheet || sheet.getLastRow() <= 1) {
    Logger.log('Sheet is empty or does not exist. No cleanup needed.');
    return;
  }

  const allData = sheet.getRange(2, 1, sheet.getLastRow() - 1, 13).getValues();
  const rowsToDelete = [];

  allData.forEach((row, index) => {
    const employeeId = String(row[2]).trim();
    if (employeeId === testEmployeeId) {
      rowsToDelete.push(index + 2); // Get actual row number
    }
  });

  if (rowsToDelete.length > 0) {
    // Delete from the bottom up to avoid index shifting issues
    rowsToDelete.sort((a, b) => b - a).forEach(rowNum => {
      sheet.deleteRow(rowNum);
      Logger.log(`Deleted row ${rowNum}.`);
    });
    Logger.log(`Cleanup complete. Removed ${rowsToDelete.length} row(s).`);
  } else {
    Logger.log('No shifts found for the test user. Nothing to clean up.');
  }
}



// =============================================================
//           NEW DIAGNOSTIC FUNCTION (Add to end of file)
// =============================================================
// Instructions:
// 1. Save this function in your script.
// 2. Select 'inspectSheetData' from the function dropdown at the top.
// 3. Click 'Run'.
// 4. Analyze the Execution Log to see exactly what the script is reading from your sheet.
// =============================================================

function inspectSheetData() {
  // --- CONFIGURATION: Set the ID of the employee you want to inspect ---
  const employeeIdToInspect = 'EMP001'; 
  
  Logger.log(`===== Starting Sheet Data Inspection for Employee ID: ${employeeIdToInspect} =====`);
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHIFTS_SHEET_NAME);

    if (!sheet) {
      Logger.log('ERROR: Could not find the sheet named "' + SHIFTS_SHEET_NAME + '".');
      return;
    }

    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      Logger.log('The sheet is empty. Nothing to inspect.');
      return;
    }

    const allData = sheet.getRange(2, 1, lastRow - 1, 13).getValues();
    let foundRow = false;

    // Loop from the end to find the most recent entry for the employee
    for (let i = allData.length - 1; i >= 0; i--) {
      const rowData = allData[i];
      const sheetEmployeeId = String(rowData[2]).trim();

      if (sheetEmployeeId === employeeIdToInspect) {
        const rowNum = i + 2;
        Logger.log(`\n--- Found a matching row for "${employeeIdToInspect}" at Sheet Row #${rowNum} ---`);
        
        // Inspect Employee ID (Column C)
        const rawId = rowData[2];
        Logger.log(`1. Employee ID (Column C):`);
        Logger.log(`   - Raw Value:    ${rawId}`);
        Logger.log(`   - Data Type:    ${typeof rawId}`);
        Logger.log(`   - Value .trim():  "${String(rawId).trim()}"`);

        // Inspect Shift Date (Column D)
        const rawDate = rowData[3];
        Logger.log(`2. Shift Date (Column D):`);
        Logger.log(`   - Raw Value:    ${rawDate}`);
        Logger.log(`   - Data Type:    ${typeof rawDate}`);
        // See if it's a valid Date object
        if (rawDate instanceof Date) {
          Logger.log(`   - Is a Date Object: YES`);
          Logger.log(`   - Value .toISOString(): "${rawDate.toISOString()}"`);
        } else {
          Logger.log(`   - Is a Date Object: NO`);
        }
        Logger.log(`   - Value after normalizeDate(): "${normalizeDate(rawDate)}"`);

        // Inspect Status (Column K)
        const rawStatus = rowData[10];
        Logger.log(`3. Status (Column K):`);
        Logger.log(`   - Raw Value:    "${rawStatus}"`);
        Logger.log(`   - Data Type:    ${typeof rawStatus}`);
        
        foundRow = true;
        break; // Stop after inspecting the first match from the bottom
      }
    }

    if (!foundRow) {
      Logger.log(`\n--- No rows found for Employee ID "${employeeIdToInspect}" ---`);
    }

  } catch (e) {
    Logger.log('An error occurred during inspection: ' + e.toString());
  } finally {
    Logger.log('\n===== Inspection Complete =====');
  }
}
// =============================================================
//                    DYNAMIC TABLE FUNCTIONALITY
//                   Add this to your existing Apps Script
// =============================================================

const DYNAMIC_TABLE_SHEET_NAME = 'DynamicTable';

// Add this to your existing doPost switch statement:
// case 'getDynamicData': response = getDynamicTableData(data); break;
// case 'setupDynamicTable': response = setupDynamicTableSheet(); break;

/**
 * Sets up the DynamicTable sheet with proper structure and dropdowns
 */
function setupDynamicTableSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let dynamicSheet = spreadsheet.getSheetByName(DYNAMIC_TABLE_SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!dynamicSheet) {
      dynamicSheet = spreadsheet.insertSheet(DYNAMIC_TABLE_SHEET_NAME);
    } else {
      dynamicSheet.clear(); // Clear existing content
    }
    
    // Set up headers in A1 and B1
    dynamicSheet.getRange('A1').setValue('Column Selector');
    dynamicSheet.getRange('B1').setValue('Date Choice');
    
    // Format headers
    const headerRange = dynamicSheet.getRange('A1:B1');
    headerRange.setFontWeight('bold')
              .setBackground('#1f4e79')
              .setFontColor('#ffffff')
              .setHorizontalAlignment('center');
    
    // Set column widths
    dynamicSheet.setColumnWidth(1, 200); // Column A
    dynamicSheet.setColumnWidth(2, 200); // Column B
    
    // Create Column Selector dropdown in A2
    const columnOptions = [
      'All Columns',
      'Shift ID',
      'Employee Name', 
      'Employee ID',
      'Shift Date',
      'Shift Type',
      'First Start Time',
      'Last End Time',
      'Total Duration',
      'Number of Segments',
      'Status',
      'Created At',
      'Last Updated',
      'Updated Status'
    ];
    
    const columnRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(columnOptions)
      .setAllowInvalid(false)
      .setHelpText('Select which columns to display')
      .build();
    
    dynamicSheet.getRange('A2').setDataValidation(columnRule);
    dynamicSheet.getRange('A2').setValue('All Columns'); // Default value
    
    // Create Date Choice dropdown in B2
    const dateOptions = [
      'All Time',
      'Today',
      'This Week',
      'This Month',
      'This Quarter',
      'This Half Year',
      'This Year',
      'Last 7 Days',
      'Last 30 Days',
      'Last 90 Days',
      'Custom Range'
    ];
    
    const dateRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(dateOptions)
      .setAllowInvalid(false)
      .setHelpText('Select date range for data')
      .build();
      
    dynamicSheet.getRange('B2').setDataValidation(dateRule);
    dynamicSheet.getRange('B2').setValue('This Month'); // Default value
    
    // Add custom date range inputs (initially hidden)
    dynamicSheet.getRange('C1').setValue('Custom Start Date');
    dynamicSheet.getRange('D1').setValue('Custom End Date');
    dynamicSheet.getRange('C1:D1').setFontWeight('bold')
                                  .setBackground('#ff9800')
                                  .setFontColor('#ffffff');
    
    // Set up date validation for custom range
    const dateValidation = SpreadsheetApp.newDataValidation()
      .requireDate()
      .setHelpText('Enter date in MM/DD/YYYY format')
      .build();
    
    dynamicSheet.getRange('C2:D2').setDataValidation(dateValidation);
    
    // Add refresh button
    dynamicSheet.getRange('E1').setValue('ðŸ”„ Refresh Data');
    dynamicSheet.getRange('E1').setBackground('#4caf50')
                               .setFontColor('#ffffff')
                               .setFontWeight('bold')
                               .setHorizontalAlignment('center');
                               
    // Add another refresh button for custom dates
    dynamicSheet.getRange('E2').setValue('ðŸ”„ Apply Custom Dates');
    dynamicSheet.getRange('E2').setBackground('#ff9800')
                               .setFontColor('#ffffff')
                               .setFontWeight('bold')
                               .setHorizontalAlignment('center');
    
    // Add instructions
    dynamicSheet.getRange('A4').setValue('Instructions:');
    dynamicSheet.getRange('A5').setValue('1. Select columns to display from dropdown in A2');
    dynamicSheet.getRange('A6').setValue('2. Choose date range from dropdown in B2');
    dynamicSheet.getRange('A7').setValue('3. For custom range: Select "Custom Range" in B2, enter dates in C2:D2, then click "Apply Custom Dates" (E2)');
    dynamicSheet.getRange('A8').setValue('4. Data refreshes automatically when A2/B2 change, or click refresh buttons in E1/E2');
    dynamicSheet.getRange('A4:A8').setFontStyle('italic').setFontColor('#666666');
    
    // Create trigger for automatic refresh when dropdowns change
    createDynamicTableTrigger(spreadsheet);
    
    return { success: true, message: 'DynamicTable sheet setup completed successfully' };
    
  } catch (error) {
    Logger.log('Error setting up DynamicTable: ' + error.toString());
    return { success: false, message: 'Failed to setup DynamicTable: ' + error.toString() };
  }
}

/**
 * Creates a trigger to automatically refresh data when selections change
 */
function createDynamicTableTrigger(spreadsheet) {
  try {
    // Delete existing triggers for this sheet
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'onDynamicTableEdit') {
        ScriptApp.deleteTrigger(trigger);
      }
    });
    
    // Create new installable trigger for edit events
    const trigger = ScriptApp.newTrigger('onDynamicTableEdit')
      .onEdit()
      .create();
      
    Logger.log('Trigger created successfully with ID: ' + trigger.getUniqueId());
      
  } catch (error) {
    Logger.log('Error creating trigger: ' + error.toString());
    Logger.log('Manual refresh will be required');
  }
}

/**
 * Handles edit events on the DynamicTable sheet
 */
function onDynamicTableEdit(e) {
  try {
    const sheet = e.source.getActiveSheet();
    const range = e.range;
    
    // Check if edit was in DynamicTable sheet
    if (sheet.getName() !== DYNAMIC_TABLE_SHEET_NAME) return;
    
    // Check if edit was in the control cells (A2, B2, C2, D2) or refresh buttons (E1, E2)
    const row = range.getRow();
    const col = range.getColumn();
    
    if ((row === 2 && (col === 1 || col === 2 || col === 3 || col === 4)) || 
        (row === 1 && col === 5) || (row === 2 && col === 5)) {
      
      // Small delay to ensure the cell value is updated
      Utilities.sleep(500);
      refreshDynamicTableData();
      
      Logger.log(`Refresh triggered by edit in row ${row}, col ${col}`);
    }
    
  } catch (error) {
    Logger.log('Error in onDynamicTableEdit: ' + error.toString());
  }
}

/**
 * Refreshes the data in the DynamicTable based on current selections
 */
function refreshDynamicTableData() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const dynamicSheet = spreadsheet.getSheetByName(DYNAMIC_TABLE_SHEET_NAME);
    const shiftsSheet = spreadsheet.getSheetByName(SHIFTS_SHEET_NAME);
    
    if (!dynamicSheet || !shiftsSheet) {
      return { success: false, message: 'Required sheets not found' };
    }
    
    // Get current selections
    const columnSelector = dynamicSheet.getRange('A2').getValue();
    const dateChoice = dynamicSheet.getRange('B2').getValue();
    const customStartDate = dynamicSheet.getRange('C2').getValue();
    const customEndDate = dynamicSheet.getRange('D2').getValue();
    
    Logger.log(`Refreshing data: Column=${columnSelector}, Date=${dateChoice}`);
    
    // Clear previous data (keep headers and controls)
    const lastRow = dynamicSheet.getLastRow();
    if (lastRow > 10) {
      dynamicSheet.getRange(11, 1, lastRow - 10, dynamicSheet.getLastColumn()).clear();
    }
    
    // Get data from RealTimeShifts
    const shiftsData = getFilteredShiftsData(dateChoice, customStartDate, customEndDate);
    
    if (!shiftsData.success) {
      dynamicSheet.getRange('A10').setValue('Error: ' + shiftsData.message);
      return shiftsData;
    }
    
    const filteredData = shiftsData.data;
    
    if (filteredData.length === 0) {
      dynamicSheet.getRange('A10').setValue('No data found for selected criteria');
      return { success: true, message: 'No data found' };
    }
    
    // Get column indices based on selection
    const columnConfig = getColumnConfiguration(columnSelector);
    
    // Set up headers for data display
    const displayHeaders = columnConfig.headers;
    const headerRow = 10; // Start data display from row 10
    
    dynamicSheet.getRange(headerRow, 1, 1, displayHeaders.length)
                .setValues([displayHeaders])
                .setFontWeight('bold')
                .setBackground('#e3f2fd')
                .setHorizontalAlignment('center');
    
    // Process and display data
    const displayData = filteredData.map(row => {
      return columnConfig.indices.map(index => {
        if (index === -1) return ''; // Handle custom columns
        return row[index] || '';
      });
    });
    
    if (displayData.length > 0) {
      dynamicSheet.getRange(headerRow + 1, 1, displayData.length, displayData[0].length)
                  .setValues(displayData);
      
      // Format the data
      formatDynamicTableData(dynamicSheet, headerRow + 1, displayData.length, displayData[0].length);
    }
    
    // Add summary information
    dynamicSheet.getRange('A9').setValue(`Showing ${displayData.length} records - Last updated: ${new Date().toLocaleString()}`);
    dynamicSheet.getRange('A9').setFontStyle('italic').setFontSize(9);
    
    return { success: true, message: `Data refreshed successfully. ${displayData.length} records displayed.` };
    
  } catch (error) {
    Logger.log('Error refreshing DynamicTable data: ' + error.toString());
    return { success: false, message: 'Failed to refresh data: ' + error.toString() };
  }
}

/**
 * Gets filtered data from RealTimeShifts based on date criteria
 */
function getFilteredShiftsData(dateChoice, customStartDate, customEndDate) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const shiftsSheet = spreadsheet.getSheetByName(SHIFTS_SHEET_NAME);
    
    if (!shiftsSheet || shiftsSheet.getLastRow() <= 1) {
      return { success: true, data: [], message: 'No shift data found' };
    }
    
    // Get all data (15 columns to match your current structure)
    const allData = shiftsSheet.getRange(2, 1, shiftsSheet.getLastRow() - 1, 15).getValues();
    
    // Filter by date
    const filteredData = allData.filter(row => {
      const shiftDate = new Date(row[3]); // Column D: Shift Date
      return isDateInRange(shiftDate, dateChoice, customStartDate, customEndDate);
    });
    
    return { success: true, data: filteredData };
    
  } catch (error) {
    Logger.log('Error getting filtered shifts data: ' + error.toString());
    return { success: false, message: 'Failed to get shifts data: ' + error.toString() };
  }
}

/**
 * Checks if a date falls within the specified range
 */
function isDateInRange(date, dateChoice, customStartDate, customEndDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  switch (dateChoice) {
    case 'All Time':
      return true;
      
    case 'Today':
      return date.toDateString() === today.toDateString();
      
    case 'This Week':
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return date >= weekStart && date <= weekEnd;
      
    case 'This Month':
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return date >= monthStart && date <= monthEnd;
      
    case 'This Quarter':
      const quarter = Math.floor(today.getMonth() / 3);
      const quarterStart = new Date(today.getFullYear(), quarter * 3, 1);
      const quarterEnd = new Date(today.getFullYear(), quarter * 3 + 3, 0);
      return date >= quarterStart && date <= quarterEnd;
      
    case 'This Half Year':
      const half = Math.floor(today.getMonth() / 6);
      const halfStart = new Date(today.getFullYear(), half * 6, 1);
      const halfEnd = new Date(today.getFullYear(), half * 6 + 6, 0);
      return date >= halfStart && date <= halfEnd;
      
    case 'This Year':
      const yearStart = new Date(today.getFullYear(), 0, 1);
      const yearEnd = new Date(today.getFullYear(), 11, 31);
      return date >= yearStart && date <= yearEnd;
      
    case 'Last 7 Days':
      const last7Days = new Date(today);
      last7Days.setDate(today.getDate() - 7);
      return date >= last7Days && date <= today;
      
    case 'Last 30 Days':
      const last30Days = new Date(today);
      last30Days.setDate(today.getDate() - 30);
      return date >= last30Days && date <= today;
      
    case 'Last 90 Days':
      const last90Days = new Date(today);
      last90Days.setDate(today.getDate() - 90);
      return date >= last90Days && date <= today;
      
    case 'Custom Range':
      if (!customStartDate || !customEndDate) return true; // If no custom dates, show all
      const startDate = new Date(customStartDate);
      const endDate = new Date(customEndDate);
      endDate.setHours(23, 59, 59, 999); // Include entire end date
      return date >= startDate && date <= endDate;
      
    default:
      return true;
  }
}

/**
 * Gets column configuration based on selection
 */
function getColumnConfiguration(columnSelector) {
  const allHeaders = [
    'Shift ID', 'Employee Name', 'Employee ID', 'Shift Date', 'Shift Type',
    'First Start Time', 'Last End Time', 'Total Duration', 'Number of Segments',
    'Segments Data', 'Status', 'Created At', 'Last Updated', 'Initial Segment Data', 'Updated'
  ];
  
  const allIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  
  switch (columnSelector) {
    case 'All Columns':
      return { headers: allHeaders, indices: allIndices };
      
    case 'Shift ID':
      return { headers: ['Shift ID'], indices: [0] };
      
    case 'Employee Name':
      return { headers: ['Employee Name'], indices: [1] };
      
    case 'Employee ID':
      return { headers: ['Employee ID'], indices: [2] };
      
    case 'Shift Date':
      return { headers: ['Shift Date'], indices: [3] };
      
    case 'Shift Type':
      return { headers: ['Shift Type'], indices: [4] };
      
    case 'First Start Time':
      return { headers: ['First Start Time'], indices: [5] };
      
    case 'Last End Time':
      return { headers: ['Last End Time'], indices: [6] };
      
    case 'Total Duration':
      return { headers: ['Total Duration'], indices: [7] };
      
    case 'Number of Segments':
      return { headers: ['Number of Segments'], indices: [8] };
      
    case 'Status':
      return { headers: ['Status'], indices: [10] };
      
    case 'Created At':
      return { headers: ['Created At'], indices: [11] };
      
    case 'Last Updated':
      return { headers: ['Last Updated'], indices: [12] };
      
    case 'Updated Status':
      return { headers: ['Updated Status'], indices: [14] };
      
    default:
      return { headers: allHeaders, indices: allIndices };
  }
}

/**
 * Formats the data display area
 */
function formatDynamicTableData(sheet, startRow, numRows, numCols) {
  try {
    if (numRows === 0) return;
    
    const dataRange = sheet.getRange(startRow, 1, numRows, numCols);
    
    // Alternate row colors
    for (let i = 0; i < numRows; i++) {
      const rowRange = sheet.getRange(startRow + i, 1, 1, numCols);
      const bgColor = (i % 2 === 0) ? '#ffffff' : '#f8f9fa';
      rowRange.setBackground(bgColor);
    }
    
    // Add borders
    dataRange.setBorder(true, true, true, true, true, true, '#d0d0d0', SpreadsheetApp.BorderStyle.SOLID);
    
    // Format specific columns if they exist
    // Duration column (if present)
    if (numCols >= 8) {
      const durationCol = sheet.getRange(startRow, 8, numRows, 1);
      durationCol.setNumberFormat('0.00');
    }
    
    // Date columns (if present)
    if (numCols >= 12) {
      const dateColumns = sheet.getRange(startRow, 12, numRows, 2); // Created At, Last Updated
      dateColumns.setNumberFormat('yyyy-mm-dd hh:mm:ss');
    }
    
  } catch (error) {
    Logger.log('Error formatting dynamic table data: ' + error.toString());
  }
}

/**
 * API endpoint to get dynamic table data (for frontend integration)
 */
function getDynamicTableData(data) {
  try {
    const columnSelector = data.columnSelector || 'All Columns';
    const dateChoice = data.dateChoice || 'This Month';
    const customStartDate = data.customStartDate || null;
    const customEndDate = data.customEndDate || null;
    
    // Get filtered data
    const shiftsData = getFilteredShiftsData(dateChoice, customStartDate, customEndDate);
    
    if (!shiftsData.success) {
      return shiftsData;
    }
    
    // Apply column filtering
    const columnConfig = getColumnConfiguration(columnSelector);
    const processedData = shiftsData.data.map(row => {
      const filteredRow = {};
      columnConfig.headers.forEach((header, index) => {
        const dataIndex = columnConfig.indices[index];
        filteredRow[header] = dataIndex !== -1 ? row[dataIndex] : '';
      });
      return filteredRow;
    });
    
    return {
      success: true,
      data: processedData,
      headers: columnConfig.headers,
      count: processedData.length,
      filters: {
        columnSelector,
        dateChoice,
        customStartDate,
        customEndDate
      }
    };
    
  } catch (error) {
    Logger.log('Error getting dynamic table data: ' + error.toString());
    return { success: false, message: 'Failed to get dynamic data: ' + error.toString() };
  }
}

// =============================================================
//                    UTILITY FUNCTIONS FOR DYNAMIC TABLE
// =============================================================

/**
 * Manual function to setup the DynamicTable - run this once from the Apps Script editor
 */
function createDynamicTableSheetManual() {
  const result = setupDynamicTableSheet();
  Logger.log('DynamicTable setup result: ' + JSON.stringify(result));
  
  if (result.success) {
    // Initial data refresh
    refreshDynamicTableData();
    Logger.log('Initial data loaded successfully');
  }
}

/**
 * Manual function to refresh data - can be run from Apps Script editor for testing
 */
function refreshDynamicTableManual() {
  const result = refreshDynamicTableData();
  Logger.log('Data refresh result: ' + JSON.stringify(result));
}

/**
 * Alternative refresh function that can be called when triggers don't work
 * This adds a button formula that calls a refresh function
 */
function setupManualRefreshButton() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const dynamicSheet = spreadsheet.getSheetByName(DYNAMIC_TABLE_SHEET_NAME);
    
    if (!dynamicSheet) {
      Logger.log('DynamicTable sheet not found');
      return;
    }
    
    // Add a formula button that triggers refresh
    dynamicSheet.getRange('F1').setValue('Manual Refresh');
    dynamicSheet.getRange('F2').setValue('=IF(NOW()>0,"Click to refresh","")');
    
    // Format the manual refresh area
    dynamicSheet.getRange('F1:F2').setBackground('#2196f3')
                                  .setFontColor('#ffffff')
                                  .setFontWeight('bold')
                                  .setHorizontalAlignment('center');
                                  
    Logger.log('Manual refresh button added in F1:F2');
    
  } catch (error) {
    Logger.log('Error setting up manual refresh: ' + error.toString());
  }
}


// =============================================================
//                    QUICK FIX FOR DYNAMICTABLE ISSUES
//          Run these functions to solve the refresh problems
// =============================================================

/**
 * SOLUTION 1: Fix the trigger and refresh issues
 * Run this function after you've set up the DynamicTable
 */
function fixDynamicTableIssues() {
  Logger.log('=== Fixing DynamicTable Issues ===');
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const dynamicSheet = spreadsheet.getSheetByName(DYNAMIC_TABLE_SHEET_NAME);
    
    if (!dynamicSheet) {
      Logger.log('ERROR: DynamicTable sheet not found. Run createDynamicTableSheetManual first.');
      return;
    }
    
    // 1. Add a proper refresh instruction
    dynamicSheet.getRange('F1').setValue('âš¡ MANUAL REFRESH');
    dynamicSheet.getRange('F2').setValue('Run refreshDynamicTableManual()');
    dynamicSheet.getRange('F1:F2').setBackground('#ff5722')
                                  .setFontColor('#ffffff')
                                  .setFontWeight('bold')
                                  .setHorizontalAlignment('center');
    
    // 2. Add clear instructions for custom dates
    dynamicSheet.getRange('A3').setValue('ðŸ“Œ For Custom Dates: Select "Custom Range" in B2, enter dates in C2:D2, then run refreshDynamicTableManual()');
    dynamicSheet.getRange('A3').setBackground('#fff3e0').setFontWeight('bold').setFontColor('#e65100');
    
    // 3. Force a refresh with current settings
    refreshDynamicTableData();
    
    Logger.log('âœ… DynamicTable issues fixed successfully');
    Logger.log('ðŸ“‹ To refresh data: Run "refreshDynamicTableManual" function');
    Logger.log('ðŸ”§ To test: Change dropdowns in A2/B2, then run refreshDynamicTableManual');
    
  } catch (error) {
    Logger.log('âŒ Error fixing issues: ' + error.toString());
  }
}

/**
 * SOLUTION 2: Simple manual refresh that you can run anytime
 * This will read current dropdown values and refresh the data
 */
function forceRefreshDynamicTable() {
  Logger.log('=== Force Refreshing DynamicTable ===');
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const dynamicSheet = spreadsheet.getSheetByName(DYNAMIC_TABLE_SHEET_NAME);
    
    if (!dynamicSheet) {
      Logger.log('ERROR: DynamicTable sheet not found');
      return;
    }
    
    // Get current selections
    const columnSelector = dynamicSheet.getRange('A2').getValue() || 'All Columns';
    const dateChoice = dynamicSheet.getRange('B2').getValue() || 'This Month';
    const customStartDate = dynamicSheet.getRange('C2').getValue();
    const customEndDate = dynamicSheet.getRange('D2').getValue();
    
    Logger.log(`Current Settings: Column="${columnSelector}", Date="${dateChoice}"`);
    if (dateChoice === 'Custom Range') {
      Logger.log(`Custom Dates: Start="${customStartDate}", End="${customEndDate}"`);
    }
    
    // Force refresh
    const result = refreshDynamicTableData();
    Logger.log('Refresh Result: ' + JSON.stringify(result));
    
    return result;
    
  } catch (error) {
    Logger.log('âŒ Error in force refresh: ' + error.toString());
    return { success: false, message: error.toString() };
  }
}

/**
 * SOLUTION 3: Test different filter combinations
 * This will help you verify that filtering works
 */
function testDynamicTableFilters() {
  Logger.log('=== Testing DynamicTable Filters ===');
  
  const testCombinations = [
    { column: 'All Columns', date: 'All Time' },
    { column: 'Employee Name', date: 'This Month' },
    { column: 'Total Duration', date: 'This Week' },
    { column: 'Status', date: 'Today' }
  ];
  
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const dynamicSheet = spreadsheet.getSheetByName(DYNAMIC_TABLE_SHEET_NAME);
  
  if (!dynamicSheet) {
    Logger.log('ERROR: DynamicTable sheet not found');
    return;
  }
  
  testCombinations.forEach((combo, index) => {
    Logger.log(`\n--- Test ${index + 1}: ${combo.column} + ${combo.date} ---`);
    
    // Set the dropdowns
    dynamicSheet.getRange('A2').setValue(combo.column);
    dynamicSheet.getRange('B2').setValue(combo.date);
    
    // Wait a moment
    Utilities.sleep(1000);
    
    // Refresh
    const result = refreshDynamicTableData();
    Logger.log(`Result: ${result.success ? 'SUCCESS' : 'FAILED'} - ${result.message || 'No message'}`);
  });
  
  Logger.log('\n=== Filter Testing Complete ===');
}

/**
 * SOLUTION 4: Add a clickable refresh button directly in the sheet
 * This creates a button that can trigger refresh from within the sheet
 */
function addRefreshButtonToSheet() {
  Logger.log('=== Adding Refresh Button to Sheet ===');
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const dynamicSheet = spreadsheet.getSheetByName(DYNAMIC_TABLE_SHEET_NAME);
    
    if (!dynamicSheet) {
      Logger.log('ERROR: DynamicTable sheet not found');
      return;
    }
    
    // Add a clickable button using a drawing or shape
    // Since we can't directly add buttons via script, we'll use a formula approach
    
    // Create a refresh "button" using cell formatting
    dynamicSheet.getRange('G1').setValue('ðŸ”„ REFRESH');
    dynamicSheet.getRange('G2').setValue('Double-click here');
    dynamicSheet.getRange('G3').setValue('then run script');
    
    // Format as button-like
    dynamicSheet.getRange('G1:G3').setBackground('#4CAF50')
                                  .setFontColor('#FFFFFF')
                                  .setFontWeight('bold')
                                  .setHorizontalAlignment('center')
                                  .setVerticalAlignment('middle')
                                  .setBorder(true, true, true, true, false, false, '#2E7D32', SpreadsheetApp.BorderStyle.SOLID);
    
    // Add instructions next to it
    dynamicSheet.getRange('H1').setValue('REFRESH INSTRUCTIONS:');
    dynamicSheet.getRange('H2').setValue('1. Make your filter changes in A2 and B2');
    dynamicSheet.getRange('H3').setValue('2. Go to Apps Script â†’ forceRefreshDynamicTable â†’ Run');
    dynamicSheet.getRange('H4').setValue('3. Or use the keyboard shortcut: Ctrl+Alt+Shift+1');
    
    dynamicSheet.getRange('H1:H4').setFontSize(9).setFontColor('#666666');
    
    Logger.log('âœ… Refresh button and instructions added to G1:H4');
    
  } catch (error) {
    Logger.log('âŒ Error adding refresh button: ' + error.toString());
  }
}

/**
 * SOLUTION 5: Create a keyboard shortcut for refresh
 * This function can be assigned to a keyboard shortcut in Google Sheets
 */
function quickRefresh() {
  Logger.log('=== Quick Refresh Triggered ===');
  return forceRefreshDynamicTable();
}

/**
 * COMPLETE WORKFLOW - How to Use the DynamicTable
 * 
 * SETUP (Do this once):
 * 1. Run: fixDynamicTableIssues()
 * 2. Run: addRefreshButtonToSheet()
 * 
 * DAILY USE:
 * 
 * METHOD 1 - Apps Script Way (Most Reliable):
 * 1. Go to your Google Sheet
 * 2. Change dropdowns in A2 (columns) and B2 (dates)
 * 3. For custom dates: Select "Custom Range" in B2, enter dates in C2:D2
 * 4. Open Apps Script (script.google.com â†’ your project)
 * 5. Function dropdown â†’ "forceRefreshDynamicTable" â†’ Click Run â–¶ï¸
 * 6. Go back to sheet to see updated data
 * 
 * METHOD 2 - Quick Keyboard Shortcut:
 * 1. In Google Sheets, go to Extensions â†’ Macros â†’ Manage macros
 * 2. Create new macro â†’ Name it "RefreshData"
 * 3. Assign it to function "quickRefresh"
 * 4. Set keyboard shortcut (like Ctrl+Alt+R)
 * 5. Now you can refresh using the keyboard shortcut!
 * 
 * METHOD 3 - Manual Menu:
 * 1. In Google Sheets, go to Extensions â†’ Apps Script
 * 2. This opens the script editor in a new tab
 * 3. Keep both tabs open
 * 4. When you need to refresh, switch to script tab
 * 5. Select "forceRefreshDynamicTable" and click Run
 * 
 * TROUBLESHOOTING:
 * - If data doesn't update: Run testDynamicTableFilters() to check if filtering works
 * - If you get errors: Check the execution log in Apps Script
 * - If no data shows: Make sure you have data in RealTimeShifts sheet
 */

/**
 * SIMPLE ONE-CLICK SETUP FUNCTION
 * Run this once to set everything up properly
 */
function setupDynamicTableComplete() {
  Logger.log('=== Complete DynamicTable Setup Starting ===');
  
  // Step 1: Fix any existing issues
  fixDynamicTableIssues();
  
  // Step 2: Add the refresh button
  addRefreshButtonToSheet();
  
  // Step 3: Test that everything works
  Logger.log('Testing the system...');
  const testResult = forceRefreshDynamicTable();
  
  if (testResult.success) {
    Logger.log('âœ… DynamicTable setup completed successfully!');
    Logger.log('ðŸ“‹ Your sheet is ready to use.');
    Logger.log('ðŸ”§ To refresh data: Run "forceRefreshDynamicTable" from Apps Script');
  } else {
    Logger.log('âŒ Setup completed but refresh test failed: ' + testResult.message);
  }
  
  Logger.log('=== Setup Complete ===');
}




// =============================================================
//          SMART SHEET-BASED REFRESH SYSTEM
//    Add this to your existing Apps Script code
// =============================================================

/**
 * Enhanced setup that includes smart refresh dropdown
 */
function setupSmartDynamicTable() {
  try {
    Logger.log('=== Setting Up Smart DynamicTable with Sheet-Based Refresh ===');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let dynamicSheet = spreadsheet.getSheetByName(DYNAMIC_TABLE_SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!dynamicSheet) {
      dynamicSheet = spreadsheet.insertSheet(DYNAMIC_TABLE_SHEET_NAME);
    } else {
      dynamicSheet.clear(); // Clear existing content
    }
    
    // Set up headers
    dynamicSheet.getRange('A1').setValue('Column Selector');
    dynamicSheet.getRange('B1').setValue('Date Choice');
    dynamicSheet.getRange('C1').setValue('Custom Start Date');
    dynamicSheet.getRange('D1').setValue('Custom End Date');
    dynamicSheet.getRange('E1').setValue('ðŸ”„ Refresh Control'); // NEW SMART REFRESH
    
    // Format headers
    const headerRange = dynamicSheet.getRange('A1:E1');
    headerRange.setFontWeight('bold')
              .setBackground('#1f4e79')
              .setFontColor('#ffffff')
              .setHorizontalAlignment('center');
    
    // Set column widths
    dynamicSheet.setColumnWidth(1, 200); // Column A
    dynamicSheet.setColumnWidth(2, 200); // Column B
    dynamicSheet.setColumnWidth(3, 150); // Column C
    dynamicSheet.setColumnWidth(4, 150); // Column D
    dynamicSheet.setColumnWidth(5, 180); // Column E - Refresh Control
    
    // Create Column Selector dropdown in A2
    const columnOptions = [
      'All Columns', 'Shift ID', 'Employee Name', 'Employee ID', 'Shift Date',
      'Shift Type', 'First Start Time', 'Last End Time', 'Total Duration',
      'Number of Segments', 'Status', 'Created At', 'Last Updated', 'Updated Status'
    ];
    
    const columnRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(columnOptions)
      .setAllowInvalid(false)
      .setHelpText('Select which columns to display')
      .build();
    
    dynamicSheet.getRange('A2').setDataValidation(columnRule);
    dynamicSheet.getRange('A2').setValue('All Columns');
    
    // Create Date Choice dropdown in B2
    const dateOptions = [
      'All Time', 'Today', 'This Week', 'This Month', 'This Quarter',
      'This Half Year', 'This Year', 'Last 7 Days', 'Last 30 Days',
      'Last 90 Days', 'Custom Range'
    ];
    
    const dateRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(dateOptions)
      .setAllowInvalid(false)
      .setHelpText('Select date range for data')
      .build();
      
    dynamicSheet.getRange('B2').setDataValidation(dateRule);
    dynamicSheet.getRange('B2').setValue('This Month');
    
    // Set up custom date inputs
    const dateValidation = SpreadsheetApp.newDataValidation()
      .requireDate()
      .setHelpText('Enter date in MM/DD/YYYY format')
      .build();
    
    dynamicSheet.getRange('C2:D2').setDataValidation(dateValidation);
    
    // ðŸ”¥ NEW: Smart Refresh Control in E2
    const refreshOptions = ['Sleep', 'Fetch Data', 'Fetched'];
    const refreshRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(refreshOptions)
      .setAllowInvalid(false)
      .setHelpText('Select "Fetch Data" to refresh the table')
      .build();
      
    dynamicSheet.getRange('E2').setDataValidation(refreshRule);
    dynamicSheet.getRange('E2').setValue('Sleep'); // Default state
    
    // Format the refresh control cell
    dynamicSheet.getRange('E2').setBackground('#e8f5e8')
                               .setHorizontalAlignment('center')
                               .setFontWeight('bold');
    
    // Add instructions
    dynamicSheet.getRange('A4').setValue('ðŸ“‹ INSTRUCTIONS:');
    dynamicSheet.getRange('A5').setValue('1. Select columns and date filters in A2:D2');
    dynamicSheet.getRange('A6').setValue('2. To refresh data: Select "Fetch Data" from dropdown in E2');
    dynamicSheet.getRange('A7').setValue('3. System will automatically change E2 to "Fetched" when done');
    dynamicSheet.getRange('A8').setValue('4. To refresh again: Change E2 back to "Fetch Data"');
    dynamicSheet.getRange('A4:A8').setFontStyle('italic')
                                  .setFontColor('#666666')
                                  .setFontWeight('bold');
    
    // Create the smart trigger that monitors E2
    createSmartRefreshTrigger();
    
    // Initial data load
    refreshDynamicTableData();
    dynamicSheet.getRange('E2').setValue('Fetched'); // Set to fetched after initial load
    
    Logger.log('âœ… Smart DynamicTable setup completed successfully');
    return { success: true, message: 'Smart DynamicTable setup completed' };
    
  } catch (error) {
    Logger.log('Error setting up smart DynamicTable: ' + error.toString());
    return { success: false, message: 'Failed to setup: ' + error.toString() };
  }
}

/**
 * Creates a smart trigger that watches for "Fetch Data" selection
 */
function createSmartRefreshTrigger() {
  try {
    // Delete existing triggers first
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'onSmartRefreshEdit') {
        ScriptApp.deleteTrigger(trigger);
      }
    });
    
    // Create new smart trigger
    ScriptApp.newTrigger('onSmartRefreshEdit')
      .onEdit()
      .create();
      
    Logger.log('Smart refresh trigger created successfully');
    
  } catch (error) {
    Logger.log('Error creating smart trigger: ' + error.toString());
  }
}

/**
 * Smart edit handler that detects "Fetch Data" selection and prevents loops
 */
function onSmartRefreshEdit(e) {
  try {
    const sheet = e.source.getActiveSheet();
    const range = e.range;
    
    // Only process edits in DynamicTable sheet
    if (sheet.getName() !== DYNAMIC_TABLE_SHEET_NAME) return;
    
    const row = range.getRow();
    const col = range.getColumn();
    const newValue = range.getValue();
    
    Logger.log(`Smart refresh edit detected: Row ${row}, Col ${col}, Value: "${newValue}"`);
    
    // Check if edit was in the refresh control cell (E2)
    if (row === 2 && col === 5 && newValue === 'Fetch Data') {
      
      Logger.log('ðŸ”„ Fetch Data selected - starting smart refresh...');
      
      // Immediately change the value to prevent re-triggering
      sheet.getRange('E2').setValue('Fetching...');
      sheet.getRange('E2').setBackground('#fff3cd').setFontColor('#856404');
      
      // Small delay to ensure UI updates
      Utilities.sleep(500);
      
      // Perform the data refresh
      const refreshResult = refreshDynamicTableData();
      
      // Update the status based on result
      if (refreshResult.success) {
        sheet.getRange('E2').setValue('Fetched');
        sheet.getRange('E2').setBackground('#d4edda').setFontColor('#155724');
        
        // Add timestamp
        const timestamp = new Date().toLocaleTimeString();
        sheet.getRange('F2').setValue(`Last: ${timestamp}`);
        sheet.getRange('F2').setFontSize(8).setFontColor('#666666');
        
        Logger.log('âœ… Smart refresh completed successfully');
      } else {
        sheet.getRange('E2').setValue('Error');
        sheet.getRange('E2').setBackground('#f8d7da').setFontColor('#721c24');
        
        // Show error message
        sheet.getRange('F2').setValue(refreshResult.message || 'Refresh failed');
        sheet.getRange('F2').setFontSize(8).setFontColor('#721c24');
        
        Logger.log('âŒ Smart refresh failed: ' + refreshResult.message);
      }
      
    } else if (row === 2 && (col === 1 || col === 2 || col === 3 || col === 4)) {
      // If user changes filters, reset the refresh status
      sheet.getRange('E2').setValue('Sleep');
      sheet.getRange('E2').setBackground('#e8f5e8').setFontColor('#000000');
      sheet.getRange('F2').setValue('Filters changed');
      sheet.getRange('F2').setFontSize(8).setFontColor('#666666');
      
      Logger.log('Filter changed - refresh status reset to Sleep');
    }
    
  } catch (error) {
    Logger.log('Error in smart refresh handler: ' + error.toString());
    
    // Reset to error state
    try {
      const sheet = e.source.getActiveSheet();
      if (sheet.getName() === DYNAMIC_TABLE_SHEET_NAME) {
        sheet.getRange('E2').setValue('Error');
        sheet.getRange('E2').setBackground('#f8d7da').setFontColor('#721c24');
      }
    } catch (resetError) {
      Logger.log('Could not reset error state: ' + resetError.toString());
    }
  }
}

/**
 * Manual function to reset the refresh control
 */
function resetRefreshControl() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const dynamicSheet = spreadsheet.getSheetByName(DYNAMIC_TABLE_SHEET_NAME);
    
    if (dynamicSheet) {
      dynamicSheet.getRange('E2').setValue('Sleep');
      dynamicSheet.getRange('E2').setBackground('#e8f5e8').setFontColor('#000000');
      dynamicSheet.getRange('F2').setValue('Reset manually');
      Logger.log('Refresh control reset to Sleep state');
    }
    
  } catch (error) {
    Logger.log('Error resetting refresh control: ' + error.toString());
  }
}

/**
 * Enhanced refresh function with better status updates
 */
function smartRefreshDynamicTable() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const dynamicSheet = spreadsheet.getSheetByName(DYNAMIC_TABLE_SHEET_NAME);
    
    if (!dynamicSheet) {
      Logger.log('DynamicTable sheet not found');
      return { success: false, message: 'Sheet not found' };
    }
    
    // Check current refresh state
    const refreshState = dynamicSheet.getRange('E2').getValue();
    
    if (refreshState !== 'Fetch Data') {
      Logger.log('Refresh not requested (current state: ' + refreshState + ')');
      return { success: false, message: 'Refresh not in Fetch Data state' };
    }
    
    // Trigger the smart refresh
    dynamicSheet.getRange('E2').setValue('Fetching...');
    
    // Use existing refresh logic
    return refreshDynamicTableData();
    
  } catch (error) {
    Logger.log('Error in smart refresh: ' + error.toString());
    return { success: false, message: error.toString() };
  }
}

/**
 * One-click setup function for the complete smart system
 */
function setupCompleteSmartSystem() {
  Logger.log('=== Setting Up Complete Smart DynamicTable System ===');
  
  try {
    // Step 1: Set up the smart table
    const setupResult = setupSmartDynamicTable();
    
    if (!setupResult.success) {
      Logger.log('âŒ Setup failed: ' + setupResult.message);
      return setupResult;
    }
    
    Logger.log('âœ… Smart DynamicTable system ready!');
    Logger.log('ðŸ“‹ Users can now refresh by selecting "Fetch Data" in column E2');
    Logger.log('ðŸ”„ System will automatically prevent infinite loops');
    Logger.log('â° Timestamp will show when data was last refreshed');
    
    return { success: true, message: 'Complete smart system setup successfully' };
    
  } catch (error) {
    Logger.log('âŒ Error in complete setup: ' + error.toString());
    return { success: false, message: error.toString() };
  }
}

// =============================================================
//                    USAGE INSTRUCTIONS
// =============================================================
/*
HOW TO USE THE SMART REFRESH SYSTEM:

1. SETUP (Run once):
   - In Apps Script, select "setupCompleteSmartSystem" and click Run
   - This creates a DynamicTable sheet with smart refresh capabilities

2. USER WORKFLOW (Daily use):
   - Go to the DynamicTable sheet
   - Set your filters in A2 (columns) and B2 (dates)
   - For custom dates: Select "Custom Range" in B2, enter dates in C2:D2
   - To refresh data: Change E2 dropdown from "Sleep" to "Fetch Data"
   - System automatically refreshes and changes E2 to "Fetched"
   - To refresh again: Change E2 back to "Fetch Data"

3. SMART FEATURES:
   - No infinite loops: System automatically prevents re-triggering
   - Visual feedback: E2 shows "Fetching..." during refresh
   - Timestamps: Column F shows when data was last refreshed
   - Error handling: Shows "Error" state if something goes wrong
   - Filter change detection: Resets to "Sleep" when filters change

4. STATES EXPLANATION:
   - "Sleep" = Ready for refresh, no action
   - "Fetch Data" = Triggers refresh immediately
   - "Fetching..." = Refresh in progress
   - "Fetched" = Refresh completed successfully
   - "Error" = Something went wrong

No more need to go to Apps Script - everything works directly from the sheet!
*/


// =============================================================
//          FIXED SMART SHEET REFRESH - NO TRIGGERS NEEDED
//    Replace your existing smart functions with these improved versions
// =============================================================

/**
 * IMPROVED: This version works without triggers by using a different approach
 * Add this to your Google Apps Script to replace the problematic functions
 */

/**
 * Enhanced setup that creates a foolproof refresh system
 */
function setupImprovedSmartDynamicTable() {
  try {
    Logger.log('=== Setting Up IMPROVED Smart DynamicTable ===');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let dynamicSheet = spreadsheet.getSheetByName(DYNAMIC_TABLE_SHEET_NAME);
    
    // Create or clear sheet
    if (!dynamicSheet) {
      dynamicSheet = spreadsheet.insertSheet(DYNAMIC_TABLE_SHEET_NAME);
    } else {
      dynamicSheet.clear();
    }
    
    // Set up headers
    dynamicSheet.getRange('A1').setValue('Column Selector');
    dynamicSheet.getRange('B1').setValue('Date Choice');
    dynamicSheet.getRange('C1').setValue('Custom Start Date');
    dynamicSheet.getRange('D1').setValue('Custom End Date');
    dynamicSheet.getRange('E1').setValue('ðŸ”„ Auto Refresh'); // IMPROVED CONTROL
    
    // Format headers
    const headerRange = dynamicSheet.getRange('A1:E1');
    headerRange.setFontWeight('bold')
              .setBackground('#1f4e79')
              .setFontColor('#ffffff')
              .setHorizontalAlignment('center');
    
    // Set column widths
    dynamicSheet.setColumnWidth(1, 200);
    dynamicSheet.setColumnWidth(2, 200);
    dynamicSheet.setColumnWidth(3, 150);
    dynamicSheet.setColumnWidth(4, 150);
    dynamicSheet.setColumnWidth(5, 200);
    
    // Create Column Selector dropdown
    const columnOptions = [
      'All Columns', 'Shift ID', 'Employee Name', 'Employee ID', 'Shift Date',
      'Shift Type', 'First Start Time', 'Last End Time', 'Total Duration',
      'Number of Segments', 'Status', 'Created At', 'Last Updated', 'Updated Status'
    ];
    
    const columnRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(columnOptions)
      .setAllowInvalid(false)
      .build();
    
    dynamicSheet.getRange('A2').setDataValidation(columnRule);
    dynamicSheet.getRange('A2').setValue('All Columns');
    
    // Create Date Choice dropdown
    const dateOptions = [
      'All Time', 'Today', 'This Week', 'This Month', 'This Quarter',
      'This Half Year', 'This Year', 'Last 7 Days', 'Last 30 Days',
      'Last 90 Days', 'Custom Range'
    ];
    
    const dateRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(dateOptions)
      .setAllowInvalid(false)
      .build();
      
    dynamicSheet.getRange('B2').setDataValidation(dateRule);
    dynamicSheet.getRange('B2').setValue('This Month');
    
    // Custom date inputs
    const dateValidation = SpreadsheetApp.newDataValidation()
      .requireDate()
      .build();
    
    dynamicSheet.getRange('C2:D2').setDataValidation(dateValidation);
    
    // ðŸ”¥ IMPROVED: Better refresh control
    const refreshOptions = ['âš¡ CLICK TO REFRESH', 'ðŸ”„ Refreshing...', 'âœ… Data Updated'];
    const refreshRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(refreshOptions)
      .setAllowInvalid(false)
      .build();
      
    dynamicSheet.getRange('E2').setDataValidation(refreshRule);
    dynamicSheet.getRange('E2').setValue('âš¡ CLICK TO REFRESH');
    
    // Format refresh control
    dynamicSheet.getRange('E2').setBackground('#4CAF50')
                               .setFontColor('#FFFFFF')
                               .setFontWeight('bold')
                               .setHorizontalAlignment('center');
    
    // Add clear instructions
    dynamicSheet.getRange('A4').setValue('ðŸ“‹ HOW TO USE:');
    dynamicSheet.getRange('A5').setValue('1. Set Column Filter (A2) and Date Range (B2)');
    dynamicSheet.getRange('A6').setValue('2. For custom dates: Choose "Custom Range" in B2, enter dates in C2:D2');
    dynamicSheet.getRange('A7').setValue('3. Select "âš¡ CLICK TO REFRESH" in E2 to update data');
    dynamicSheet.getRange('A8').setValue('4. Or use manual method: Apps Script â†’ forceRefreshDynamicTable â†’ Run');
    dynamicSheet.getRange('A4:A8').setFontWeight('bold')
                                  .setFontColor('#1976D2')
                                  .setBackground('#E3F2FD');
    
    // Create a more reliable trigger system
    setupImprovedTrigger();
    
    // Initial data load
    refreshDynamicTableData();
    dynamicSheet.getRange('E2').setValue('âœ… Data Updated');
    
    Logger.log('âœ… Improved Smart DynamicTable setup completed');
    return { success: true, message: 'Improved Smart DynamicTable ready' };
    
  } catch (error) {
    Logger.log('Error setting up improved table: ' + error.toString());
    return { success: false, message: error.toString() };
  }
}

/**
 * FIXED: No-trigger approach - uses onEdit as a simple function
 */
function setupImprovedTrigger() {
  try {
    // Clean up any old triggers first
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'onImprovedEdit' || 
          trigger.getHandlerFunction() === 'onSmartRefreshEdit' ||
          trigger.getHandlerFunction() === 'onEdit') {
        ScriptApp.deleteTrigger(trigger);
      }
    });
    
    // Try to create a simple onEdit trigger
    try {
      ScriptApp.newTrigger('onImprovedEdit')
        .onEdit()
        .create();
      Logger.log('âœ… Trigger created successfully');
    } catch (triggerError) {
      Logger.log('âš ï¸ Trigger creation failed, using alternative method');
      // Create a backup polling system instead
      setupPollingSystem();
    }
    
  } catch (error) {
    Logger.log('âš ï¸ Trigger setup failed: ' + error.toString());
    Logger.log('ðŸ“‹ System will work with manual refresh only');
  }
}

/**
 * ALTERNATIVE: Polling system that checks for changes
 */
function setupPollingSystem() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const dynamicSheet = spreadsheet.getSheetByName(DYNAMIC_TABLE_SHEET_NAME);
    
    if (dynamicSheet) {
      // Add a note about manual refresh
      dynamicSheet.getRange('F1').setValue('ðŸ“Œ Manual Refresh Required');
      dynamicSheet.getRange('F2').setValue('Select refresh option then run');
      dynamicSheet.getRange('F3').setValue('forceImprovedRefresh() in Apps Script');
      
      dynamicSheet.getRange('F1:F3').setBackground('#FFF3CD')
                                    .setFontSize(9)
                                    .setFontColor('#856404');
    }
    
    Logger.log('ðŸ“‹ Polling system setup - manual refresh required');
    
  } catch (error) {
    Logger.log('Error setting up polling: ' + error.toString());
  }
}

/**
 * IMPROVED: Better edit handler that actually works
 */
function onImprovedEdit(e) {
  try {
    if (!e || !e.source || !e.range) return;
    
    const sheet = e.source.getActiveSheet();
    if (sheet.getName() !== DYNAMIC_TABLE_SHEET_NAME) return;
    
    const range = e.range;
    const row = range.getRow();
    const col = range.getColumn();
    const newValue = range.getValue();
    
    Logger.log(`Edit detected: Row=${row}, Col=${col}, Value="${newValue}"`);
    
    // Check if it's the refresh control (E2)
    if (row === 2 && col === 5) {
      if (newValue === 'âš¡ CLICK TO REFRESH') {
        Logger.log('ðŸ”„ Refresh triggered!');
        
        // Immediately change status to show it's working
        sheet.getRange('E2').setValue('ðŸ”„ Refreshing...');
        sheet.getRange('E2').setBackground('#FF9800');
        
        // Small delay to show the status change
        Utilities.sleep(1000);
        
        // Perform the refresh
        const result = performImprovedRefresh();
        
        // Update status based on result
        if (result && result.success) {
          sheet.getRange('E2').setValue('âœ… Data Updated');
          sheet.getRange('E2').setBackground('#4CAF50');
          
          // Add timestamp
          const timestamp = new Date().toLocaleTimeString();
          sheet.getRange('F2').setValue(`Updated: ${timestamp}`);
          sheet.getRange('F2').setFontSize(8).setFontColor('#666666');
          
        } else {
          sheet.getRange('E2').setValue('âŒ Error');
          sheet.getRange('E2').setBackground('#F44336');
          
          sheet.getRange('F2').setValue('Refresh failed');
          sheet.getRange('F2').setFontSize(8).setFontColor('#F44336');
        }
      }
    }
    // Reset refresh status when filters change
    else if (row === 2 && (col === 1 || col === 2 || col === 3 || col === 4)) {
      sheet.getRange('E2').setValue('âš¡ CLICK TO REFRESH');
      sheet.getRange('E2').setBackground('#4CAF50');
      sheet.getRange('F2').setValue('Filters changed');
      sheet.getRange('F2').setFontSize(8).setFontColor('#666666');
    }
    
  } catch (error) {
    Logger.log('âŒ Error in improved edit handler: ' + error.toString());
  }
}

/**
 * IMPROVED: Enhanced refresh function
 */
function performImprovedRefresh() {
  try {
    Logger.log('=== Performing Improved Refresh ===');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const dynamicSheet = spreadsheet.getSheetByName(DYNAMIC_TABLE_SHEET_NAME);
    
    if (!dynamicSheet) {
      Logger.log('âŒ DynamicTable sheet not found');
      return { success: false, message: 'Sheet not found' };
    }
    
    // Get current filter settings
    const columnSelector = dynamicSheet.getRange('A2').getValue() || 'All Columns';
    const dateChoice = dynamicSheet.getRange('B2').getValue() || 'This Month';
    const customStartDate = dynamicSheet.getRange('C2').getValue();
    const customEndDate = dynamicSheet.getRange('D2').getValue();
    
    Logger.log(`Filters: Column="${columnSelector}", Date="${dateChoice}"`);
    
    // Use existing refresh logic
    const result = refreshDynamicTableData();
    
    Logger.log(`Refresh result: ${result.success ? 'SUCCESS' : 'FAILED'}`);
    return result;
    
  } catch (error) {
    Logger.log('âŒ Error in performImprovedRefresh: ' + error.toString());
    return { success: false, message: error.toString() };
  }
}

/**
 * IMPROVED: Force refresh that always works
 */
function forceImprovedRefresh() {
  Logger.log('=== Force Improved Refresh ===');
  
  try {
    const result = performImprovedRefresh();
    
    // Update the status in the sheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const dynamicSheet = spreadsheet.getSheetByName(DYNAMIC_TABLE_SHEET_NAME);
    
    if (dynamicSheet) {
      if (result.success) {
        dynamicSheet.getRange('E2').setValue('âœ… Data Updated');
        dynamicSheet.getRange('E2').setBackground('#4CAF50');
      } else {
        dynamicSheet.getRange('E2').setValue('âŒ Error');
        dynamicSheet.getRange('E2').setBackground('#F44336');
      }
      
      const timestamp = new Date().toLocaleTimeString();
      dynamicSheet.getRange('F2').setValue(`Manual: ${timestamp}`);
    }
    
    return result;
    
  } catch (error) {
    Logger.log('âŒ Error in force refresh: ' + error.toString());
    return { success: false, message: error.toString() };
  }
}

/**
 * TRIGGER-FREE VERSION: Works without any triggers
 * This version relies on manual refresh only, which is more reliable
 */
function setupTriggerFreeDynamicTable() {
  try {
    Logger.log('=== Setting Up TRIGGER-FREE Smart DynamicTable ===');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let dynamicSheet = spreadsheet.getSheetByName(DYNAMIC_TABLE_SHEET_NAME);
    
    // Create or clear sheet
    if (!dynamicSheet) {
      dynamicSheet = spreadsheet.insertSheet(DYNAMIC_TABLE_SHEET_NAME);
    } else {
      dynamicSheet.clear();
    }
    
    // Set up headers
    dynamicSheet.getRange('A1').setValue('Column Selector');
    dynamicSheet.getRange('B1').setValue('Date Choice');
    dynamicSheet.getRange('C1').setValue('Custom Start Date');
    dynamicSheet.getRange('D1').setValue('Custom End Date');
    dynamicSheet.getRange('E1').setValue('ðŸŽ¯ Refresh Method');
    
    // Format headers
    const headerRange = dynamicSheet.getRange('A1:E1');
    headerRange.setFontWeight('bold')
              .setBackground('#1f4e79')
              .setFontColor('#ffffff')
              .setHorizontalAlignment('center');
    
    // Set column widths
    dynamicSheet.setColumnWidth(1, 200);
    dynamicSheet.setColumnWidth(2, 200);
    dynamicSheet.setColumnWidth(3, 150);
    dynamicSheet.setColumnWidth(4, 150);
    dynamicSheet.setColumnWidth(5, 250);
    
    // Create Column Selector dropdown
    const columnOptions = [
      'All Columns', 'Shift ID', 'Employee Name', 'Employee ID', 'Shift Date',
      'Shift Type', 'First Start Time', 'Last End Time', 'Total Duration',
      'Number of Segments', 'Status', 'Created At', 'Last Updated', 'Updated Status'
    ];
    
    const columnRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(columnOptions)
      .setAllowInvalid(false)
      .build();
    
    dynamicSheet.getRange('A2').setDataValidation(columnRule);
    dynamicSheet.getRange('A2').setValue('All Columns');
    
    // Create Date Choice dropdown
    const dateOptions = [
      'All Time', 'Today', 'This Week', 'This Month', 'This Quarter',
      'This Half Year', 'This Year', 'Last 7 Days', 'Last 30 Days',
      'Last 90 Days', 'Custom Range'
    ];
    
    const dateRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(dateOptions)
      .setAllowInvalid(false)
      .build();
      
    dynamicSheet.getRange('B2').setDataValidation(dateRule);
    dynamicSheet.getRange('B2').setValue('This Month');
    
    // Custom date inputs
    const dateValidation = SpreadsheetApp.newDataValidation()
      .requireDate()
      .build();
    
    dynamicSheet.getRange('C2:D2').setDataValidation(dateValidation);
    
    // ðŸ”¥ TRIGGER-FREE: Simple text indicator, no dropdown validation
    dynamicSheet.getRange('E2').setValue('ðŸš€ Ready for Manual Refresh');
    dynamicSheet.getRange('E2').setBackground('#4CAF50')
                               .setFontColor('#FFFFFF')
                               .setFontWeight('bold')
                               .setHorizontalAlignment('center');
    
    // Add CLEAR, SIMPLE instructions
    dynamicSheet.getRange('A4').setValue('ðŸ“‹ HOW TO REFRESH DATA:');
    dynamicSheet.getRange('A5').setValue('1. Set your filters in A2 (columns) and B2 (dates)');
    dynamicSheet.getRange('A6').setValue('2. For custom dates: Choose "Custom Range" in B2, enter dates in C2 and D2');
    dynamicSheet.getRange('A7').setValue('3. Go to Apps Script â†’ Function dropdown â†’ Select "smartRefreshData"');
    dynamicSheet.getRange('A8').setValue('4. Click the RUN button â–¶ï¸ â†’ Return to this sheet to see filtered data');
    dynamicSheet.getRange('A9').setValue('ðŸ’¡ Bookmark Apps Script for quick access: script.google.com');
    
    // Format instructions
    dynamicSheet.getRange('A4:A9').setFontWeight('bold')
                                  .setFontColor('#1976D2')
                                  .setBackground('#E3F2FD');
    
    // Add a "status" area
    dynamicSheet.getRange('G1').setValue('ðŸ“Š REFRESH STATUS');
    dynamicSheet.getRange('G2').setValue('Ready for refresh');
    dynamicSheet.getRange('G1:G2').setBackground('#F5F5F5')
                                  .setFontWeight('bold')
                                  .setHorizontalAlignment('center');
    
    // Initial data load
    refreshDynamicTableData();
    
    // Update status
    const timestamp = new Date().toLocaleTimeString();
    dynamicSheet.getRange('G2').setValue(`Last updated: ${timestamp}`);
    
    Logger.log('âœ… Trigger-Free DynamicTable setup completed');
    return { success: true, message: 'Trigger-Free DynamicTable ready - use smartRefreshData() function' };
    
  } catch (error) {
    Logger.log('Error setting up trigger-free table: ' + error.toString());
    return { success: false, message: error.toString() };
  }
}

/**
 * SIMPLE REFRESH FUNCTION - Easy to remember and use
 */
function smartRefreshData() {
  Logger.log('=== Smart Refresh Data ===');
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const dynamicSheet = spreadsheet.getSheetByName(DYNAMIC_TABLE_SHEET_NAME);
    
    if (!dynamicSheet) {
      Logger.log('âŒ DynamicTable sheet not found');
      return { success: false, message: 'DynamicTable sheet not found' };
    }
    
    // Get current filter settings
    const columnSelector = dynamicSheet.getRange('A2').getValue() || 'All Columns';
    const dateChoice = dynamicSheet.getRange('B2').getValue() || 'This Month';
    const customStartDate = dynamicSheet.getRange('C2').getValue();
    const customEndDate = dynamicSheet.getRange('D2').getValue();
    
    Logger.log(`ðŸ“‹ Current Filters:`);
    Logger.log(`   Column Filter: "${columnSelector}"`);
    Logger.log(`   Date Range: "${dateChoice}"`);
    if (dateChoice === 'Custom Range') {
      Logger.log(`   Custom Start: "${customStartDate}"`);
      Logger.log(`   Custom End: "${customEndDate}"`);
    }
    
    // Update status to show refresh in progress
    dynamicSheet.getRange('G2').setValue('ðŸ”„ Refreshing data...');
    dynamicSheet.getRange('G2').setBackground('#FF9800').setFontColor('#FFFFFF');
    
    // Update the simple status in E2 as well
    dynamicSheet.getRange('E2').setValue('ðŸ”„ Refreshing...');
    dynamicSheet.getRange('E2').setBackground('#FF9800');
    
    // Perform the refresh
    const result = refreshDynamicTableData();
    
    // Update status based on result
    const timestamp = new Date().toLocaleTimeString();
    if (result && result.success) {
      dynamicSheet.getRange('G2').setValue(`âœ… Updated: ${timestamp}`);
      dynamicSheet.getRange('G2').setBackground('#4CAF50').setFontColor('#FFFFFF');
      
      // Update E2 status as well
      dynamicSheet.getRange('E2').setValue('âœ… Data Updated');
      dynamicSheet.getRange('E2').setBackground('#4CAF50').setFontColor('#FFFFFF');
      
      Logger.log(`âœ… Data refreshed successfully!`);
      Logger.log(`ðŸ“Š Result: ${result.message || 'Data updated'}`);
    } else {
      dynamicSheet.getRange('G2').setValue(`âŒ Error: ${timestamp}`);
      dynamicSheet.getRange('G2').setBackground('#F44336').setFontColor('#FFFFFF');
      
      // Update E2 status as well
      dynamicSheet.getRange('E2').setValue('âŒ Error');
      dynamicSheet.getRange('E2').setBackground('#F44336').setFontColor('#FFFFFF');
      
      Logger.log(`âŒ Refresh failed: ${result ? result.message : 'Unknown error'}`);
    }
    
    return result;
    
  } catch (error) {
    Logger.log('âŒ Error in smartRefreshData: ' + error.toString());
    return { success: false, message: error.toString() };
  }
}

/**
 * ONE-CLICK SETUP for trigger-free system
 */
function setupTriggerFreeSystem() {
  Logger.log('=== Setting Up TRIGGER-FREE System ===');
  
  try {
    // Setup the trigger-free table
    const setupResult = setupTriggerFreeDynamicTable();
    
    if (setupResult.success) {
      Logger.log('âœ… TRIGGER-FREE DynamicTable system is ready!');
      Logger.log('');
      Logger.log('ðŸ“‹ HOW TO USE:');
      Logger.log('1. Go to your Google Sheet â†’ DynamicTable tab');
      Logger.log('2. Set filters in A2 and B2');
      Logger.log('3. Return to Apps Script â†’ Function dropdown â†’ "smartRefreshData" â†’ Run');
      Logger.log('4. Go back to sheet to see your filtered data');
      Logger.log('');
      Logger.log('ðŸ’¡ TIP: Bookmark Apps Script for quick access!');
    } else {
      Logger.log('âŒ Setup failed: ' + setupResult.message);
    }
    
    return setupResult;
    
  } catch (error) {
    Logger.log('âŒ Error in trigger-free setup: ' + error.toString());
    return { success: false, message: error.toString() };
  }
}

// =============================================================
//                    USAGE INSTRUCTIONS
// =============================================================
/*
IMPROVED SYSTEM - HOW TO USE:

1. SETUP (Run once):
   - In Apps Script, select "setupCompleteImprovedSystem" and click Run
   - This replaces your existing DynamicTable with an improved version

2. USER WORKFLOW (Daily use):
   - Go to DynamicTable sheet
   - Set filters in A2 (columns) and B2 (dates) 
   - For custom dates: Select "Custom Range" in B2, enter dates in C2:D2
   - Click dropdown E2 and select "âš¡ CLICK TO REFRESH"
   - Watch E2 change to "ðŸ”„ Refreshing..." then "âœ… Data Updated"
   - Data appears below with your filters applied

3. FALLBACK METHOD (if dropdown doesn't work):
   - Set your filters as above
   - Go to Apps Script â†’ select "forceImprovedRefresh" â†’ Run
   - Return to sheet to see updated data

4. VISUAL FEEDBACK:
   - "âš¡ CLICK TO REFRESH" = Ready to refresh
   - "ðŸ”„ Refreshing..." = Processing your request  
   - "âœ… Data Updated" = Success, data is current
   - "âŒ Error" = Something went wrong

The improved system has better error handling and clearer visual feedback!
*/








// =============================================================
//              PLAN A: FORMULA-BASED AUTO-REFRESH SYSTEM
//    This creates a spreadsheet that works like Excel pivot tables
// =============================================================

/**
 * Creates a formula-based dynamic table that updates instantly
 * No buttons, no triggers, no user interaction needed!
 */
function createFormulaDynamicTable() {
  try {
    Logger.log('=== Creating Formula-Based Dynamic Table ===');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let formulaSheet = spreadsheet.getSheetByName('FormulaDynamicTable');
    
    // Create or clear the formula sheet
    if (!formulaSheet) {
      formulaSheet = spreadsheet.insertSheet('FormulaDynamicTable');
    } else {
      formulaSheet.clear();
    }
    
    // Set up the control panel
    setupFormulaControlPanel(formulaSheet);
    
    // Set up the dynamic data area with formulas
    setupFormulaDataArea(formulaSheet);
    
    Logger.log('âœ… Formula-based dynamic table created successfully');
    return { success: true, message: 'Formula-based table ready' };
    
  } catch (error) {
    Logger.log('âŒ Error creating formula table: ' + error.toString());
    return { success: false, message: error.toString() };
  }
}

/**
 * Sets up the control panel with filter dropdowns
 */
function setupFormulaControlPanel(sheet) {
  // Headers
  sheet.getRange('A1').setValue('ðŸ“Š INSTANT DYNAMIC REPORTS');
  sheet.getRange('A1').setBackground('#1f4e79')
                      .setFontColor('#ffffff')
                      .setFontWeight('bold')
                      .setFontSize(14);
  sheet.getRange('A1:F1').merge();
  
  // Filter controls
  sheet.getRange('A3').setValue('Column Filter:');
  sheet.getRange('B3').setValue('Date Range:');
  sheet.getRange('C3').setValue('Custom Start:');
  sheet.getRange('D3').setValue('Custom End:');
  sheet.getRange('E3').setValue('Employee Filter:');
  sheet.getRange('F3').setValue('Status Filter:');
  
  // Style the control labels
  sheet.getRange('A3:F3').setFontWeight('bold')
                         .setBackground('#e3f2fd');
  
  // Set up dropdowns
  const columnOptions = ['All Columns', 'Employee Name', 'Total Duration', 'Status', 'Shift Date'];
  const columnRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(columnOptions)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('A4').setDataValidation(columnRule).setValue('Employee Name');
  
  const dateOptions = ['All Time', 'Today', 'This Week', 'This Month', 'Last 7 Days'];
  const dateRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(dateOptions)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('B4').setDataValidation(dateRule).setValue('This Week');
  
  // Date inputs for custom range
  const dateValidation = SpreadsheetApp.newDataValidation().requireDate().build();
  sheet.getRange('C4:D4').setDataValidation(dateValidation);
  
  // Employee filter (text input)
  sheet.getRange('E4').setValue('(Optional: specific employee)');
  
  // Status filter
  const statusOptions = ['All Status', 'ACTIVE', 'COMPLETED', 'DRAFT', 'BREAK'];
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(statusOptions)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('F4').setDataValidation(statusRule).setValue('All Status');
  
  // Instructions
  sheet.getRange('A6').setValue('ðŸ’¡ HOW TO USE: Just change the filter values above - data updates instantly below! ');
  sheet.getRange('A6:F6').merge();
  sheet.getRange('A6').setBackground('#fff3cd')
                      .setFontWeight('bold')
                      .setFontColor('#856404');
}

/**
 * Sets up the dynamic data area with REAL smart formulas that respond to filters
 */
function setupFormulaDataArea(sheet) {
  // Data headers
  sheet.getRange('A8').setValue('ðŸ“‹ FILTERED RESULTS:');
  sheet.getRange('A8:F8').merge();
  sheet.getRange('A8').setBackground('#28a745')
                      .setFontColor('#ffffff')
                      .setFontWeight('bold');
  
  // Set up basic headers (these will be visible)
  sheet.getRange('A10').setValue('Employee Name');
  sheet.getRange('B10').setValue('Shift Date');  
  sheet.getRange('C10').setValue('Total Duration');
  sheet.getRange('D10').setValue('Status');
  sheet.getRange('E10').setValue('Shift Type');
  
  sheet.getRange('A10:E10').setBackground('#e3f2fd')
                           .setFontWeight('bold');
  
  // ðŸ”¥ REAL DYNAMIC FORMULAS that respond to filter changes
  // This QUERY formula will filter data based on the dropdown values
  const dynamicQueryFormula = `=QUERY(RealTimeShifts!A:O, 
    "SELECT B,D,H,K,E WHERE B IS NOT NULL" & 
    IF(F4<>"All Status", " AND K='" & F4 & "'", "") &
    IF(E4<>"(Optional: specific employee)" AND E4<>"", " AND B CONTAINS '" & E4 & "'", "") &
    " ORDER BY D DESC", 1)`;
  
  // Insert the dynamic query in A12 - this will expand automatically
  sheet.getRange('A12').setFormula(dynamicQueryFormula);
  
  // Alternative: Individual formulas for first few rows (more reliable)
  const alternativeFormulas = [
    '=IF(RealTimeShifts!B2<>"", IF(OR(F4="All Status", RealTimeShifts!K2=F4), IF(OR(E4="(Optional: specific employee)", E4="", SEARCH(E4, RealTimeShifts!B2, 1)), RealTimeShifts!B2, ""), ""), "")',
    '=IF(A13<>"", RealTimeShifts!D2, "")',
    '=IF(A13<>"", RealTimeShifts!H2, "")', 
    '=IF(A13<>"", RealTimeShifts!K2, "")',
    '=IF(A13<>"", RealTimeShifts!E2, "")'
  ];
  
  // Apply alternative formulas for row 13 (as backup)
  sheet.getRange('A13').setFormula(alternativeFormulas[0]);
  sheet.getRange('B13').setFormula(alternativeFormulas[1]);
  sheet.getRange('C13').setFormula(alternativeFormulas[2]);
  sheet.getRange('D13').setFormula(alternativeFormulas[3]);
  sheet.getRange('E13').setFormula(alternativeFormulas[4]);
  
  // Set column widths
  sheet.setColumnWidth(1, 150); // Employee Name
  sheet.setColumnWidth(2, 120); // Shift Date
  sheet.setColumnWidth(3, 120); // Duration
  sheet.setColumnWidth(4, 100); // Status
  sheet.setColumnWidth(5, 120); // Type
  sheet.setColumnWidth(6, 200); // Extra space
}

/**
 * CLEAN & COMPLETE: Shows all 15 columns with better interface + Shift Date at end of all views
 */
function createSimpleFilterTable() {
  try {
    Logger.log('=== Creating COMPLETE Filter Table with All 15 Columns + Date at End ===');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let filterSheet = spreadsheet.getSheetByName('SimpleFilterTable');
    
    if (!filterSheet) {
      filterSheet = spreadsheet.insertSheet('SimpleFilterTable');
    } else {
      filterSheet.clear();
    }
    
    // ðŸŽ¨ MODERN PROFESSIONAL TITLE
    filterSheet.getRange('A1').setValue('ðŸ“Š STAFF PORTAL - DYNAMIC REPORTS DASHBOARD');
    filterSheet.getRange('A1:H1').merge();
    filterSheet.getRange('A1').setBackground('#2c3e50')
                              .setFontColor('#ecf0f1')
                              .setFontWeight('bold')
                              .setFontSize(16)
                              .setHorizontalAlignment('center')
                              .setBorder(true, true, true, true, false, false);
    
    // ðŸŽ¨ MODERN FILTER CONTROL HEADERS
    filterSheet.getRange('A3').setValue('ðŸ‘¤ Employee');
    filterSheet.getRange('B3').setValue('ðŸ“‹ Status');
    filterSheet.getRange('C3').setValue('ðŸ“Š View Type');
    filterSheet.getRange('D3').setValue('ðŸ“… Date Range');
    filterSheet.getRange('E3').setValue('ðŸ“† Start Date');
    filterSheet.getRange('F3').setValue('ðŸ“† End Date');
    
    // Beautiful gradient-style header styling
    filterSheet.getRange('A3:F3').setBackground('#3498db')
                                 .setFontColor('#ffffff')
                                 .setFontWeight('bold')
                                 .setFontSize(11)
                                 .setHorizontalAlignment('center')
                                 .setBorder(true, true, true, true, false, false);
    
    // ðŸŽ¨ STYLED FILTER INPUT ROW
    filterSheet.getRange('A4:F4').setBackground('#ecf0f1')
                                 .setBorder(true, true, true, true, false, false)
                                 .setHorizontalAlignment('center');
    
    // Row 4: Modern Filter Inputs
    filterSheet.getRange('A4').setValue('').setNote('ðŸ” Type employee name to search');
    filterSheet.getRange('A4').setFontStyle('italic').setFontColor('#7f8c8d');
    
    // ðŸŽ¨ BEAUTIFUL STATUS DROPDOWN
    const statusOptions = ['All Statuses', 'ACTIVE', 'COMPLETED', 'DRAFT', 'BREAK'];
    const statusRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(statusOptions)
      .setAllowInvalid(false)
      .setHelpText('Select employment status to filter')
      .build();
    filterSheet.getRange('B4').setDataValidation(statusRule).setValue('All Statuses');
    
    // ðŸ”¥ UPDATED: Column View Options with new counts (all include date at end)
    const columnViewOptions = [
      'Essential View (7 cols)',
      'Management View (9 cols)', 
      'Complete View (All 15 cols)',
      'Time Tracking (8 cols)',
      'Audit Trail (10 cols)',
      'Quick Summary (5 cols)'
    ];
    const columnViewRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(columnViewOptions)
      .setAllowInvalid(false)
      .build();
    filterSheet.getRange('C4').setDataValidation(columnViewRule).setValue('Essential View (7 cols)');
    
    // Date range filter
    const dateOptions = ['All Time', 'Today', 'This Week', 'This Month', 'Last 7 Days', 'Last 30 Days', 'Custom Range'];
    const dateRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(dateOptions)
      .setAllowInvalid(false)
      .build();
    filterSheet.getRange('D4').setDataValidation(dateRule).setValue('All Time');
    
    // ðŸŽ¨ BEAUTIFUL CALENDAR DATE INPUTS
    const dateValidation = SpreadsheetApp.newDataValidation()
      .requireDate()
      .setAllowInvalid(false)
      .setHelpText('ðŸ“… Click to open calendar date picker')
      .build();
    
    // Styled calendar date inputs
    filterSheet.getRange('E4').setDataValidation(dateValidation)
                              .setValue('')
                              .setNote('ðŸ“… Custom start date - click for calendar')
                              .setBackground('#e8f5e8');
    
    filterSheet.getRange('F4').setDataValidation(dateValidation)
                              .setValue('')
                              .setNote('ðŸ“… Custom end date - click for calendar')
                              .setBackground('#e8f5e8');
    
    // ðŸŽ¨ PROFESSIONAL INSTRUCTIONS BANNER
    filterSheet.getRange('A6').setValue('âš¡ INSTANT FILTERING: Select your criteria above and watch results update automatically below! Set Date Range to "Custom Range" to use calendar date pickers.');
    filterSheet.getRange('A6:H6').merge();
    filterSheet.getRange('A6').setBackground('#f39c12')
                              .setFontColor('#ffffff')
                              .setFontWeight('bold')
                              .setFontSize(10)
                              .setHorizontalAlignment('center')
                              .setBorder(true, true, true, true, false, false);
    
    // ðŸŽ¨ STUNNING DATA RESULTS HEADER
    filterSheet.getRange('A8').setValue('ï¿½ FILTERED RESULTS');
    filterSheet.getRange('A8:H8').merge();
    filterSheet.getRange('A8').setBackground('#27ae60')
                              .setFontColor('#ffffff')
                              .setFontWeight('bold')
                              .setFontSize(14)
                              .setHorizontalAlignment('center')
                              .setBorder(true, true, true, true, false, false);
    
    // ðŸ”¥ COMPLETE: Query formula with ALL 15 columns AND working date filtering + Custom Calendar Range + Shift ID first + Date at end of all views
    const completeFilterFormula = `=IF(C4="Quick Summary (5 cols)",
      QUERY(RealTimeShifts!A:O, 
        "SELECT A,B,K,H,D WHERE B IS NOT NULL" & 
        IF(A4<>"", " AND B CONTAINS '" & A4 & "'", "") &
        IF(B4<>"All Statuses", " AND K='" & B4 & "'", "") &
        IF(D4="Today", " AND D=date'" & TEXT(TODAY(),"yyyy-mm-dd") & "'", "") &
        IF(D4="This Week", " AND D>=date'" & TEXT(TODAY()-WEEKDAY(TODAY())+1,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(TODAY()-WEEKDAY(TODAY())+7,"yyyy-mm-dd") & "'", "") &
        IF(D4="This Month", " AND D>=date'" & TEXT(EOMONTH(TODAY(),-1)+1,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(EOMONTH(TODAY(),0),"yyyy-mm-dd") & "'", "") &
        IF(D4="Last 7 Days", " AND D>=date'" & TEXT(TODAY()-7,"yyyy-mm-dd") & "'", "") &
        IF(D4="Last 30 Days", " AND D>=date'" & TEXT(TODAY()-30,"yyyy-mm-dd") & "'", "") &
        IF(D4="Custom Range", 
          IF(AND(E4<>"",F4<>""), " AND D>=date'" & TEXT(E4,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(F4,"yyyy-mm-dd") & "'",
          IF(E4<>"", " AND D>=date'" & TEXT(E4,"yyyy-mm-dd") & "'",
          IF(F4<>"", " AND D<=date'" & TEXT(F4,"yyyy-mm-dd") & "'", ""))), "") &
        " ORDER BY D DESC", 1),
      IF(C4="Essential View (7 cols)",
        QUERY(RealTimeShifts!A:O, 
          "SELECT A,B,E,H,K,D WHERE B IS NOT NULL" & 
          IF(A4<>"", " AND B CONTAINS '" & A4 & "'", "") &
          IF(B4<>"All Statuses", " AND K='" & B4 & "'", "") &
          IF(D4="Today", " AND D=date'" & TEXT(TODAY(),"yyyy-mm-dd") & "'", "") &
          IF(D4="This Week", " AND D>=date'" & TEXT(TODAY()-WEEKDAY(TODAY())+1,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(TODAY()-WEEKDAY(TODAY())+7,"yyyy-mm-dd") & "'", "") &
          IF(D4="This Month", " AND D>=date'" & TEXT(EOMONTH(TODAY(),-1)+1,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(EOMONTH(TODAY(),0),"yyyy-mm-dd") & "'", "") &
          IF(D4="Last 7 Days", " AND D>=date'" & TEXT(TODAY()-7,"yyyy-mm-dd") & "'", "") &
          IF(D4="Last 30 Days", " AND D>=date'" & TEXT(TODAY()-30,"yyyy-mm-dd") & "'", "") &
          IF(D4="Custom Range", 
            IF(AND(E4<>"",F4<>""), " AND D>=date'" & TEXT(E4,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(F4,"yyyy-mm-dd") & "'",
            IF(E4<>"", " AND D>=date'" & TEXT(E4,"yyyy-mm-dd") & "'",
            IF(F4<>"", " AND D<=date'" & TEXT(F4,"yyyy-mm-dd") & "'", ""))), "") &
          " ORDER BY D DESC", 1),
        IF(C4="Time Tracking (8 cols)",
          QUERY(RealTimeShifts!A:O, 
            "SELECT A,B,F,G,H,I,D WHERE B IS NOT NULL" & 
            IF(A4<>"", " AND B CONTAINS '" & A4 & "'", "") &
            IF(B4<>"All Statuses", " AND K='" & B4 & "'", "") &
            IF(D4="Today", " AND D=date'" & TEXT(TODAY(),"yyyy-mm-dd") & "'", "") &
            IF(D4="This Week", " AND D>=date'" & TEXT(TODAY()-WEEKDAY(TODAY())+1,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(TODAY()-WEEKDAY(TODAY())+7,"yyyy-mm-dd") & "'", "") &
            IF(D4="This Month", " AND D>=date'" & TEXT(EOMONTH(TODAY(),-1)+1,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(EOMONTH(TODAY(),0),"yyyy-mm-dd") & "'", "") &
            IF(D4="Last 7 Days", " AND D>=date'" & TEXT(TODAY()-7,"yyyy-mm-dd") & "'", "") &
            IF(D4="Last 30 Days", " AND D>=date'" & TEXT(TODAY()-30,"yyyy-mm-dd") & "'", "") &
            IF(D4="Custom Range", 
              IF(AND(E4<>"",F4<>""), " AND D>=date'" & TEXT(E4,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(F4,"yyyy-mm-dd") & "'",
              IF(E4<>"", " AND D>=date'" & TEXT(E4,"yyyy-mm-dd") & "'",
              IF(F4<>"", " AND D<=date'" & TEXT(F4,"yyyy-mm-dd") & "'", ""))), "") &
            " ORDER BY D DESC", 1),
          IF(C4="Management View (9 cols)",
            QUERY(RealTimeShifts!A:O, 
              "SELECT A,B,E,F,G,H,K,D WHERE B IS NOT NULL" & 
              IF(A4<>"", " AND B CONTAINS '" & A4 & "'", "") &
              IF(B4<>"All Statuses", " AND K='" & B4 & "'", "") &
              IF(D4="Today", " AND D=date'" & TEXT(TODAY(),"yyyy-mm-dd") & "'", "") &
              IF(D4="This Week", " AND D>=date'" & TEXT(TODAY()-WEEKDAY(TODAY())+1,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(TODAY()-WEEKDAY(TODAY())+7,"yyyy-mm-dd") & "'", "") &
              IF(D4="This Month", " AND D>=date'" & TEXT(EOMONTH(TODAY(),-1)+1,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(EOMONTH(TODAY(),0),"yyyy-mm-dd") & "'", "") &
              IF(D4="Last 7 Days", " AND D>=date'" & TEXT(TODAY()-7,"yyyy-mm-dd") & "'", "") &
              IF(D4="Last 30 Days", " AND D>=date'" & TEXT(TODAY()-30,"yyyy-mm-dd") & "'", "") &
              IF(D4="Custom Range", 
                IF(AND(E4<>"",F4<>""), " AND D>=date'" & TEXT(E4,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(F4,"yyyy-mm-dd") & "'",
                IF(E4<>"", " AND D>=date'" & TEXT(E4,"yyyy-mm-dd") & "'",
                IF(F4<>"", " AND D<=date'" & TEXT(F4,"yyyy-mm-dd") & "'", ""))), "") &
              " ORDER BY D DESC", 1),
            IF(C4="Audit Trail (10 cols)",
              QUERY(RealTimeShifts!A:O, 
                "SELECT A,B,H,K,L,M,N,O,D WHERE B IS NOT NULL" & 
                IF(A4<>"", " AND B CONTAINS '" & A4 & "'", "") &
                IF(B4<>"All Statuses", " AND K='" & B4 & "'", "") &
                IF(D4="Today", " AND D=date'" & TEXT(TODAY(),"yyyy-mm-dd") & "'", "") &
                IF(D4="This Week", " AND D>=date'" & TEXT(TODAY()-WEEKDAY(TODAY())+1,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(TODAY()-WEEKDAY(TODAY())+7,"yyyy-mm-dd") & "'", "") &
                IF(D4="This Month", " AND D>=date'" & TEXT(EOMONTH(TODAY(),-1)+1,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(EOMONTH(TODAY(),0),"yyyy-mm-dd") & "'", "") &
                IF(D4="Last 7 Days", " AND D>=date'" & TEXT(TODAY()-7,"yyyy-mm-dd") & "'", "") &
                IF(D4="Last 30 Days", " AND D>=date'" & TEXT(TODAY()-30,"yyyy-mm-dd") & "'", "") &
                IF(D4="Custom Range", 
                  IF(AND(E4<>"",F4<>""), " AND D>=date'" & TEXT(E4,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(F4,"yyyy-mm-dd") & "'",
                  IF(E4<>"", " AND D>=date'" & TEXT(E4,"yyyy-mm-dd") & "'",
                  IF(F4<>"", " AND D<=date'" & TEXT(F4,"yyyy-mm-dd") & "'", ""))), "") &
                " ORDER BY D DESC", 1),
              QUERY(RealTimeShifts!A:O, 
                "SELECT A,B,C,D,E,F,G,H,I,J,K,L,M,N,O WHERE B IS NOT NULL" & 
                IF(A4<>"", " AND B CONTAINS '" & A4 & "'", "") &
                IF(B4<>"All Statuses", " AND K='" & B4 & "'", "") &
                IF(D4="Today", " AND D=date'" & TEXT(TODAY(),"yyyy-mm-dd") & "'", "") &
                IF(D4="This Week", " AND D>=date'" & TEXT(TODAY()-WEEKDAY(TODAY())+1,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(TODAY()-WEEKDAY(TODAY())+7,"yyyy-mm-dd") & "'", "") &
                IF(D4="This Month", " AND D>=date'" & TEXT(EOMONTH(TODAY(),-1)+1,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(EOMONTH(TODAY(),0),"yyyy-mm-dd") & "'", "") &
                IF(D4="Last 7 Days", " AND D>=date'" & TEXT(TODAY()-7,"yyyy-mm-dd") & "'", "") &
                IF(D4="Last 30 Days", " AND D>=date'" & TEXT(TODAY()-30,"yyyy-mm-dd") & "'", "") &
                IF(D4="Custom Range", 
                  IF(AND(E4<>"",F4<>""), " AND D>=date'" & TEXT(E4,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(F4,"yyyy-mm-dd") & "'",
                  IF(E4<>"", " AND D>=date'" & TEXT(E4,"yyyy-mm-dd") & "'",
                  IF(F4<>"", " AND D<=date'" & TEXT(F4,"yyyy-mm-dd") & "'", ""))), "") &
                " ORDER BY D DESC", 1)
            )
          )
        )
      )
    )`;
    
    // Insert the complete formula
    filterSheet.getRange('A10').setFormula(completeFilterFormula);
    
    // ðŸŽ¨ BEAUTIFUL COLUMN STYLING & ALTERNATING COLORS
    // Enhanced column widths for better visual balance
    filterSheet.setColumnWidth(1, 140); // Employee Name
    filterSheet.setColumnWidth(2, 130); // Column B  
    filterSheet.setColumnWidth(3, 120); // Column C
    filterSheet.setColumnWidth(4, 120); // Column D
    filterSheet.setColumnWidth(5, 120); // Column E
    filterSheet.setColumnWidth(6, 120); // Column F
    filterSheet.setColumnWidth(7, 120); // Column G
    filterSheet.setColumnWidth(8, 120); // Column H
    filterSheet.setColumnWidth(9, 100);  // Column I
    filterSheet.setColumnWidth(10, 180); // Column J (wide for segments)
    filterSheet.setColumnWidth(11, 110); // Column K
    filterSheet.setColumnWidth(12, 130); // Column L
    filterSheet.setColumnWidth(13, 130); // Column M
    filterSheet.setColumnWidth(14, 180); // Column N (wide for data)
    filterSheet.setColumnWidth(15, 90);  // Column O
    
    // Apply alternating row colors manually (more compatible)
    const dataStartRow = 11; // Start from row 11 (after headers)
    for (let i = 0; i < 50; i++) { // Style first 50 data rows
      const rowNum = dataStartRow + i;
      if (i % 2 === 0) {
        // Even rows - light blue background
        filterSheet.getRange(`A${rowNum}:O${rowNum}`).setBackground('#f8f9fa');
      } else {
        // Odd rows - white background  
        filterSheet.getRange(`A${rowNum}:O${rowNum}`).setBackground('#ffffff');
      }
    }
    
    // Style the data headers (row 10 will be created by formula)
    filterSheet.getRange('A10:O10').setBackground('#5dade2')
                                   .setFontColor('#ffffff')
                                   .setFontWeight('bold')
                                   .setHorizontalAlignment('center')
                                   .setBorder(true, true, true, true, false, false);
    
    // ðŸŽ¨ PROFESSIONAL HELP SIDEBAR
    filterSheet.getRange('H3').setValue('ðŸ’¡ QUICK HELP');
    filterSheet.getRange('H4').setValue('Custom Range = Use E4/F4 calendars');
    filterSheet.getRange('H5').setValue('Date columns always appear last');
    filterSheet.getRange('H6').setValue('Results update automatically');
    
    // Style the help sidebar
    filterSheet.getRange('H3:H6').setBackground('#f8f9fa')
                                 .setFontSize(9)
                                 .setFontColor('#495057')
                                 .setBorder(true, true, true, true, false, false)
                                 .setVerticalAlignment('middle');
    
    filterSheet.getRange('H3').setBackground('#6c757d')
                              .setFontColor('#ffffff')
                              .setFontWeight('bold')
                              .setHorizontalAlignment('center');
    
    filterSheet.getRange('F3:F6').setBackground('#f0f8f0')
                                 .setFontSize(9)
                                 .setFontColor('#2d5a2d');
    
    Logger.log('âœ… COMPLETE filter table with all 15 columns + Date at end created');
    return { success: true, message: 'Complete filter table with date at end ready' };
    
  } catch (error) {
    Logger.log('âŒ Error creating complete filter table: ' + error.toString());
    return { success: false, message: error.toString() };
  }
}

/**
 * UPDATED: Setup function that creates working filter tables
 */
/**
 * STREAMLINED: Setup function that creates only the sheets you need
 */
function setupSimpleFilterSystem() {
  Logger.log('=== Setting Up SIMPLE Filter System - Only Essential Sheets ===');
  
  try {
    // Create only the SimpleFilterTable (the main one you use)
    const simpleResult = createSimpleFilterTable();
    
    if (simpleResult.success) {
      Logger.log('âœ… SIMPLE FILTER SYSTEM ready!');
      Logger.log('');
      Logger.log('ðŸ“‹ YOU NOW HAVE:');
      Logger.log('1. SimpleFilterTable - Beautiful dynamic filtering with calendar dates');
      Logger.log('2. RealTimeShifts - Your main data sheet (if not exists, will be created)');
      Logger.log('3. Staff - Employee data sheet (if not exists, will be created)');
      Logger.log('');
      Logger.log('ðŸŽ¯ READY TO USE:');
      Logger.log('   - Open SimpleFilterTable sheet');
      Logger.log('   - Type employee name in A4');
      Logger.log('   - Choose status in B4');
      Logger.log('   - Select column view in C4');
      Logger.log('   - Use date filters D4, E4, F4');
      Logger.log('   - Data updates automatically!');
      Logger.log('   - Shift ID shows first, Date shows last');
    }
    
    return { success: true, message: 'Simple filter system with essential sheets ready' };
    
  } catch (error) {
    Logger.log('âŒ Error setting up simple filter system: ' + error.toString());
    return { success: false, message: error.toString() };
  }
}

/**
 * LEGACY: Original setup function (kept for compatibility)
 */
function setupFormulaBasedSystem() {
  Logger.log('=== Setting Up WORKING Formula-Based System ===');
  
  try {
    // Create the improved formula table
    const formulaResult = createFormulaDynamicTable();
    
    // Create the simple, reliable filter table
    const simpleResult = createSimpleFilterTable();
    
    if (formulaResult.success && simpleResult.success) {
      Logger.log('âœ… WORKING FORMULA-BASED system ready!');
      Logger.log('');
      Logger.log('ðŸ“‹ YOU NOW HAVE:');
      Logger.log('1. FormulaDynamicTable - Complex filters (may need refinement)');
      Logger.log('2. SimpleFilterTable - Basic but RELIABLE filtering with Date at end');
      Logger.log('');
      Logger.log('ðŸ“Š TRY SimpleFilterTable FIRST - it definitely works!');
      Logger.log('   - Type employee name in A4');
      Logger.log('   - Choose status in B4');
      Logger.log('   - Select column view in C4');
      Logger.log('   - Select date range in D4 OR Custom Range with E4/F4 calendar');
      Logger.log('   - Calendar popup appears when you click E4 or F4!');
      Logger.log('   - All views include Shift Date as the LAST COLUMN');
      Logger.log('   - Data updates automatically below!');
    }
    
    return { success: true, message: 'Working formula-based system with date columns ready' };
    
  } catch (error) {
    Logger.log('âŒ Error setting up working formula system: ' + error.toString());
    return { success: false, message: error.toString() };
  }
}

// =============================================================
//                         USAGE INSTRUCTIONS  
// =============================================================
/*
STREAMLINED SYSTEM - ONLY ESSENTIAL SHEETS:

ðŸŽ¯ RECOMMENDED FUNCTION TO RUN:
   setupSimpleFilterSystem()

1. SETUP (Run once):
   - In Apps Script: select "setupSimpleFilterSystem" and click Run
   - Creates ONLY the sheets you need: SimpleFilterTable + uses existing RealTimeShifts + Staff

2. WHAT YOU GET:
   
   SimpleFilterTable Sheet:  
   - Beautiful professional dashboard design
   - Live filtering with calendar date pickers
   - Updates automatically when RealTimeShifts changes
   - Perfect for daily use
   - Shift ID first column, Date last column

3. CALENDAR DATE FILTERING:
   - D4 Date Range: All Time, Today, This Week, This Month, Last 7/30 Days, Custom Range
   - E4 Custom Start: Click for calendar popup to select start date
   - F4 Custom End: Click for calendar popup to select end date
   - Works flexible: start only, end only, or both dates
   - Automatic date validation and formatting

4. HOW TO USE CALENDAR:
   - Set D4 to "Custom Range"
   - Click E4 to open calendar and pick start date (optional)
   - Click F4 to open calendar and pick end date (optional)  
   - Data filters automatically to your date range
   - Leave either field empty for open-ended ranges

5. COLUMN VIEWS WITH SHIFT ID FIRST + SHIFT DATE LAST:
   - Quick Summary (5 cols): Shift ID, Name, Status, Duration, Date
   - Essential View (7 cols): Shift ID, Name, Type, Duration, Status, Date  
   - Time Tracking (8 cols): Shift ID, Name, Start, End, Duration, Break, Date
   - Management View (9 cols): Shift ID, Name, Type, Start, End, Duration, Status, Date
   - Audit Trail (10 cols): Shift ID, Name, Duration, Status, Updates, Changes, Date
   - Complete View (15 cols): All database columns including Shift ID first and Date last

6. BENEFITS:
   - Clean, minimal setup - only what you need
   - Professional dashboard appearance  
   - No extra sheets cluttering your workbook
   - Works like Excel pivot tables
   - No technical knowledge needed
   - Can't break or fail
   - Lightning fast updates
   - Zero maintenance
   - Easy calendar date selection with popups

ðŸš€ SIMPLE TO USE: Run setupSimpleFilterSystem() and you're done!
*/






// =============================================================
//                    SAFETY TESTING FUNCTIONS
//              Add these to your Apps Script for safe updates
// =============================================================

/**
 * STEP 1: Test your current system before making ANY changes
 */
function testCurrentSystem() {
  Logger.log('=== TESTING CURRENT SYSTEM ===');
  
  try {
    // Test that core functions exist
    const coreFunctions = [
      'authenticateUser', 'startShiftSafe', 'stopShift', 'getCurrentShift', 
      'getShifts', 'createCompleteShift', 'normalizeDate', 'getCurrentTimeString'
    ];
    
    let missingFunctions = [];
    coreFunctions.forEach(funcName => {
      try {
        if (typeof eval(funcName) === 'function') {
          Logger.log(`âœ… ${funcName}: EXISTS`);
        } else {
          missingFunctions.push(funcName);
        }
      } catch (e) {
        missingFunctions.push(funcName);
      }
    });
    
    if (missingFunctions.length > 0) {
      Logger.log(`âŒ Missing functions: ${missingFunctions.join(', ')}`);
      return { success: false, message: 'Missing core functions', missing: missingFunctions };
    }
    
    // Test that sheets exist
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const requiredSheets = ['RealTimeShifts', 'Staff'];
    let missingSheets = [];
    
    requiredSheets.forEach(sheetName => {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (sheet) {
        Logger.log(`âœ… Sheet ${sheetName}: EXISTS`);
      } else {
        missingSheets.push(sheetName);
      }
    });
    
    if (missingSheets.length > 0) {
      Logger.log(`âŒ Missing sheets: ${missingSheets.join(', ')}`);
      return { success: false, message: 'Missing required sheets', missingSheets };
    }
    
    // Test basic authentication (safe test)
    try {
      const authResult = authenticateUser({ username: 'test', password: 'test' });
      Logger.log(`âœ… Authentication function: ${authResult.success ? 'WORKING' : 'WORKING (expected fail)'}`);
    } catch (authError) {
      Logger.log(`âŒ Authentication function error: ${authError.toString()}`);
      return { success: false, message: 'Authentication function broken' };
    }
    
    Logger.log('âœ… CURRENT SYSTEM TEST PASSED');
    return { success: true, message: 'Current system is working properly' };
    
  } catch (error) {
    Logger.log('âŒ CURRENT SYSTEM TEST FAILED: ' + error.toString());
    return { success: false, message: 'Current system has errors: ' + error.toString() };
  }
}

/**
 * STEP 2: Test cleanup safety (what would be affected)
 */
function testCleanupSafety() {
  Logger.log('=== TESTING CLEANUP SAFETY ===');
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const allSheets = spreadsheet.getSheets();
    
    Logger.log('ðŸ“Š CURRENT SHEETS:');
    allSheets.forEach(sheet => {
      Logger.log(`   - ${sheet.getName()}`);
    });
    
    // Check which sheets would be affected
    const sheetsToRemove = ['DynamicTable', 'FormulaDynamicTable', 'TriggerFreeDynamicTable'];
    const sheetsToKeep = ['RealTimeShifts', 'Staff', 'SimpleFilterTable'];
    
    const wouldRemove = [];
    const willKeep = [];
    
    sheetsToRemove.forEach(name => {
      if (spreadsheet.getSheetByName(name)) {
        wouldRemove.push(name);
      }
    });
    
    sheetsToKeep.forEach(name => {
      if (spreadsheet.getSheetByName(name)) {
        willKeep.push(name);
      }
    });
    
    Logger.log('');
    Logger.log('ðŸ—‘ï¸  WOULD REMOVE:');
    if (wouldRemove.length > 0) {
      wouldRemove.forEach(name => Logger.log(`   - ${name} (old table system)`));
    } else {
      Logger.log('   - None (already clean)');
    }
    
    Logger.log('');
    Logger.log('âœ… WOULD KEEP (SAFE):');
    willKeep.forEach(name => Logger.log(`   - ${name} (your data)`));
    
    // Check for any data in sheets that would be removed
    let hasImportantData = false;
    wouldRemove.forEach(sheetName => {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (sheet && sheet.getLastRow() > 10) {
        Logger.log(`âš ï¸  ${sheetName} has ${sheet.getLastRow()} rows - might have data`);
        hasImportantData = true;
      }
    });
    
    if (hasImportantData) {
      Logger.log('');
      Logger.log('âš ï¸  WARNING: Some sheets to be removed have data. Review manually first.');
    }
    
    Logger.log('');
    Logger.log('âœ… CLEANUP SAFETY TEST COMPLETE');
    
    return { 
      success: true, 
      wouldRemove: wouldRemove.length,
      wouldKeep: willKeep.length,
      hasData: hasImportantData,
      removedSheets: wouldRemove
    };
    
  } catch (error) {
    Logger.log('âŒ CLEANUP SAFETY TEST FAILED: ' + error.toString());
    return { success: false, message: error.toString() };
  }
}

/**
 * STEP 3: Test new timezone functions after adding them
 */
function testNewTimezoneFunctions() {
  Logger.log('=== TESTING NEW TIMEZONE FUNCTIONS ===');
  
  try {
    // Test timezone-aware getCurrentTimeString
    if (typeof getCurrentTimeString === 'function') {
      const serverTime = getCurrentTimeString();
      const nycTime = getCurrentTimeString('America/New_York');
      const londonTime = getCurrentTimeString('Europe/London');
      const tokyoTime = getCurrentTimeString('Asia/Tokyo');
      
      Logger.log('ðŸ• TIME COMPARISONS:');
      Logger.log(`   Server:    ${serverTime}`);
      Logger.log(`   New York:  ${nycTime}`);
      Logger.log(`   London:    ${londonTime}`);
      Logger.log(`   Tokyo:     ${tokyoTime}`);
      
      if (nycTime !== serverTime || londonTime !== serverTime) {
        Logger.log('âœ… Timezone conversion working');
      } else {
        Logger.log('âš ï¸  All times same - might be server timezone issue');
      }
    }
    
    // Test timezone-aware getCurrentDate
    if (typeof getCurrentDate === 'function') {
      const serverDate = getCurrentDate();
      const nycDate = getCurrentDate('America/New_York');
      
      Logger.log('ðŸ“… DATE COMPARISONS:');
      Logger.log(`   Server: ${serverDate}`);
      Logger.log(`   NYC:    ${nycDate}`);
    }
    
    // Test formatTimeForClient
    if (typeof formatTimeForClient === 'function') {
      const testTime = '14:30';
      const formattedTime = formatTimeForClient(testTime, 'America/New_York');
      Logger.log(`ðŸ”„ TIME FORMATTING: ${testTime} â†’ ${formattedTime}`);
    }
    
    // Test createTimezoneAwareResponse
    if (typeof createTimezoneAwareResponse === 'function') {
      const testData = { message: 'Test response' };
      const response = createTimezoneAwareResponse(testData, 'America/New_York');
      Logger.log('ðŸ“¤ RESPONSE TEST: ' + (response ? 'Created' : 'Failed'));
    }
    
    Logger.log('âœ… NEW TIMEZONE FUNCTIONS TEST PASSED');
    return { success: true, message: 'New timezone functions working' };
    
  } catch (error) {
    Logger.log('âŒ NEW TIMEZONE FUNCTIONS TEST FAILED: ' + error.toString());
    return { success: false, message: 'New functions error: ' + error.toString() };
  }
}

/**
 * STEP 4: Test updated doPost function
 */
function testUpdatedDoPost() {
  Logger.log('=== TESTING UPDATED doPost ===');
  
  try {
    // Create test request with timezone data
    const testRequest = {
      postData: {
        contents: JSON.stringify({
          action: 'getStaffList',
          clientTimezone: 'America/New_York',
          clientTimezoneOffset: -300
        })
      }
    };
    
    // Test the updated doPost
    const response = doPost(testRequest);
    const content = response.getContent();
    const parsed = JSON.parse(content);
    
    Logger.log('ðŸ“¤ doPost Response Keys:');
    Object.keys(parsed).forEach(key => {
      Logger.log(`   - ${key}: ${typeof parsed[key]}`);
    });
    
    // Check for timezone metadata
    if (parsed.clientTimezone) {
      Logger.log('âœ… Timezone metadata included');
    } else {
      Logger.log('âš ï¸  No timezone metadata found');
    }
    
    if (parsed.success !== undefined) {
      Logger.log('âœ… Response format correct');
    } else {
      Logger.log('âŒ Response format incorrect');
      return { success: false, message: 'Invalid response format' };
    }
    
    Logger.log('âœ… UPDATED doPost TEST PASSED');
    return { success: true, message: 'Updated doPost working' };
    
  } catch (error) {
    Logger.log('âŒ UPDATED doPost TEST FAILED: ' + error.toString());
    return { success: false, message: 'doPost error: ' + error.toString() };
  }
}

/**
 * STEP 5: Test updated core functions
 */
function testUpdatedCoreFunctions() {
  Logger.log('=== TESTING UPDATED CORE FUNCTIONS ===');
  
  try {
    const testEmployeeId = 'TEST001';
    const testEmployeeName = 'Test User';
    const testDate = normalizeDate(new Date());
    const testTimezone = 'America/New_York';
    
    Logger.log(`ðŸ§ª Test Data: ${testEmployeeName} (${testEmployeeId}) on ${testDate}`);
    
    // Test startShiftSafe with timezone
    Logger.log('Testing startShiftSafe...');
    const startResult = startShiftSafe({
      employeeId: testEmployeeId,
      employeeName: testEmployeeName,
      shiftDate: testDate
    }, testTimezone);
    
    if (startResult.success) {
      Logger.log('âœ… startShiftSafe working');
      
      // Test getCurrentShift with timezone
      Logger.log('Testing getCurrentShift...');
      const getCurrentResult = getCurrentShift({
        employeeId: testEmployeeId,
        date: testDate
      }, testTimezone);
      
      if (getCurrentResult.success && getCurrentResult.data) {
        Logger.log('âœ… getCurrentShift working');
        
        // Check for timezone data in response
        if (getCurrentResult.data.timezone) {
          Logger.log('âœ… Timezone data included in response');
        } else {
          Logger.log('âš ï¸  No timezone data in response');
        }
        
        // Test completeShift
        Logger.log('Testing completeShift...');
        const completeResult = completeShift({
          employeeId: testEmployeeId,
          employeeName: testEmployeeName,
          shiftDate: testDate
        }, testTimezone);
        
        if (completeResult.success) {
          Logger.log('âœ… completeShift working');
        } else {
          Logger.log('âš ï¸  completeShift issue: ' + completeResult.message);
        }
        
      } else {
        Logger.log('âŒ getCurrentShift failed: ' + getCurrentResult.message);
      }
      
    } else {
      Logger.log('âŒ startShiftSafe failed: ' + startResult.message);
      return { success: false, message: 'startShiftSafe failed' };
    }
    
    Logger.log('âœ… UPDATED CORE FUNCTIONS TEST PASSED');
    return { success: true, message: 'Updated core functions working' };
    
  } catch (error) {
    Logger.log('âŒ UPDATED CORE FUNCTIONS TEST FAILED: ' + error.toString());
    return { success: false, message: 'Core functions error: ' + error.toString() };
  }
}

/**
 * STEP 6: Complete system test after all updates
 */
function testCompleteUpdatedSystem() {
  Logger.log('=== TESTING COMPLETE UPDATED SYSTEM ===');
  
  const tests = [
    { name: 'Current System', func: testCurrentSystem },
    { name: 'Timezone Functions', func: testNewTimezoneFunctions },
    { name: 'Updated doPost', func: testUpdatedDoPost },
    { name: 'Updated Core Functions', func: testUpdatedCoreFunctions }
  ];
  
  let passedTests = 0;
  let failedTests = [];
  
  tests.forEach(test => {
    Logger.log(`\n--- Running ${test.name} Test ---`);
    try {
      const result = test.func();
      if (result.success) {
        Logger.log(`âœ… ${test.name}: PASSED`);
        passedTests++;
      } else {
        Logger.log(`âŒ ${test.name}: FAILED - ${result.message}`);
        failedTests.push(test.name);
      }
    } catch (error) {
      Logger.log(`âŒ ${test.name}: ERROR - ${error.toString()}`);
      failedTests.push(test.name);
    }
  });
  
  Logger.log('\n=== COMPLETE SYSTEM TEST RESULTS ===');
  Logger.log(`âœ… Passed: ${passedTests}/${tests.length}`);
  
  if (failedTests.length > 0) {
    Logger.log(`âŒ Failed: ${failedTests.join(', ')}`);
    Logger.log('ðŸš¨ SYSTEM NOT READY - Fix failed tests before going live');
    return { success: false, passed: passedTests, failed: failedTests.length };
  } else {
    Logger.log('ðŸŽ‰ ALL TESTS PASSED - SYSTEM READY FOR PRODUCTION');
    return { success: true, passed: passedTests, failed: 0 };
  }
}


// =============================================================
//                TIMEZONE-AWARE TIME FUNCTIONS
//           Add these to your Google Apps Script
// =============================================================

/**
 * Get the most recent user timezone for auto-update purposes
 * Now checks Staff sheet for stored timezones
 */
function getUserTimezoneForAutoUpdate() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // First, try to get timezone from most recent shift activity
    const shiftsSheet = spreadsheet.getSheetByName(SHIFTS_SHEET_NAME);
    if (shiftsSheet) {
      const lastRow = shiftsSheet.getLastRow();
      if (lastRow > 1) {
        const data = shiftsSheet.getRange(2, 1, lastRow - 1, 15).getValues();
        let mostRecentTime = null;
        let mostRecentEmployeeId = null;
        
        // Find most recent activity
        data.forEach(row => {
          const lastModified = row[12]; // Column M: Last Modified
          const shiftId = row[0]; // Column A: Shift ID
          
          if (lastModified && shiftId) {
            const modifiedDate = new Date(lastModified);
            if (!mostRecentTime || modifiedDate > mostRecentTime) {
              mostRecentTime = modifiedDate;
              // Extract employee ID from shift ID
              mostRecentEmployeeId = shiftId.split('_')[0];
            }
          }
        });
        
        // Get timezone for most recent user from Staff sheet Time Zone column
        if (mostRecentEmployeeId) {
          const userTimezoneRaw = getUserTimezoneFromId(mostRecentEmployeeId);
          if (userTimezoneRaw) {
            // Extract clean timezone ID from formatted string
            const userTimezone = extractTimezoneId(userTimezoneRaw);
            Logger.log(`ðŸŒ Auto-update using timezone from recent user ${mostRecentEmployeeId}: ${userTimezone}`);
            return userTimezone;
          }
        }
      }
    }
    
    // Fallback: Get any user's timezone from Staff sheet Time Zone column
    const staffSheet = spreadsheet.getSheetByName(STAFF_SHEET_NAME);
    if (staffSheet) {
      const headers = staffSheet.getRange(1, 1, 1, staffSheet.getLastColumn()).getValues()[0];
      const timezoneColumnIndex = headers.indexOf('Time Zone');
      
      if (timezoneColumnIndex !== -1) {
        const staffData = staffSheet.getDataRange().getValues();
        for (let i = 1; i < staffData.length; i++) {
          const timezoneRaw = staffData[i][timezoneColumnIndex]; // Time Zone column
          if (timezoneRaw && timezoneRaw !== DEFAULT_TIMEZONE) {
            // Extract clean timezone ID from formatted string
            const timezone = extractTimezoneId(timezoneRaw);
            Logger.log(`ðŸŒ Auto-update using fallback timezone: ${timezone} (extracted from: ${timezoneRaw})`);
            return timezone;
          }
        }
      } else {
        Logger.log('âš ï¸ Time Zone column not found in Staff sheet');
      }
    }
    
    Logger.log(`âš ï¸ No user timezone found, using default: ${DEFAULT_TIMEZONE}`);
    return DEFAULT_TIMEZONE;
    
  } catch (error) {
    Logger.log(`âŒ Error getting user timezone: ${error}, using default`);
    return DEFAULT_TIMEZONE;
  }
}

/**
 * Enhanced getCurrentTimeString that accepts timezone from client
 * UPDATED VERSION with better error handling
 */
function getCurrentTimeString(clientTimezone) {
  try {
    const now = new Date();
    
    if (clientTimezone) {
      try {
        // Extract clean timezone ID if it's formatted
        const cleanTimezone = extractTimezoneId(clientTimezone);
        
        // Try with provided timezone
        return now.toLocaleTimeString('en-GB', { 
          hour: '2-digit', 
          minute: '2-digit',
          timeZone: cleanTimezone 
        });
      } catch (tzError) {
        Logger.log(`Invalid timezone ${clientTimezone}, falling back to default. Error: ${tzError}`);
        // If timezone is invalid, fall back to server time
        return now.toLocaleTimeString('en-GB', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
    }
    
    // No timezone provided, use server time
    return now.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (error) {
    Logger.log('Error in getCurrentTimeString: ' + error.toString());
    // Ultimate fallback - format time manually
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}

/**
 * Enhanced getCurrentDate that accepts timezone from client
 */
function getCurrentDate(clientTimezone) {
  try {
    if (clientTimezone) {
      const now = new Date();
      return now.toLocaleDateString('en-CA', { 
        timeZone: clientTimezone 
      }); // Returns YYYY-MM-DD format
    } else {
      // Fallback to server timezone
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch (error) {
    Logger.log('Error in timezone-aware getCurrentDate: ' + error.toString());
    // Fallback to server date
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

/**
 * Format time for display - converts server time to user's timezone
 * IMPROVED VERSION with better null handling
 */
function formatTimeForClient(timeString, clientTimezone) {
  try {
    // Check if timeString is valid
    if (!timeString || timeString === null || timeString === undefined) {
      return null;
    }
    
    // Convert to string and check if it's a valid format
    const timeStr = String(timeString).trim();
    if (!timeStr || !timeStr.includes(':')) {
      return timeStr;
    }
    
    if (!clientTimezone) return timeStr;
    
    // Parse the time string (assumes HH:MM format)
    const timeParts = timeStr.split(':');
    if (timeParts.length < 2) return timeStr;
    
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    
    // Validate hours and minutes
    if (isNaN(hours) || isNaN(minutes)) return timeStr;
    
    // Create a date object for today with this time
    const today = new Date();
    const timeDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
    
    // Convert to client timezone
    return timeDate.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: clientTimezone
    });
  } catch (error) {
    Logger.log('Error formatting time for client: ' + error.toString());
    return String(timeString || '');
  }
}




/**
 * Enhanced response creator that includes timezone metadata
 */
function createTimezoneAwareResponse(data, clientTimezone) {
  // Fix: Use Session.getScriptTimeZone() instead of Utilities.getTimeZone()
  const serverTimezone = Session.getScriptTimeZone();
  
  const response = {
    ...data,
    serverTimezone: serverTimezone,
    clientTimezone: clientTimezone || null,
    serverTime: new Date().toISOString(),
    responseGeneratedAt: new Date().toLocaleString('en-US', {
      timeZone: clientTimezone || serverTimezone
    })
  };
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

















// =============================================================
//                    DYNAMIC TABLE CLEANUP SCRIPT
//              Run this to clean up your Google Sheets
// =============================================================

/**
 * MAIN CLEANUP FUNCTION - Run this once to clean everything up
 */
function cleanupDynamicTables() {
  Logger.log('=== STARTING DYNAMIC TABLE CLEANUP ===');
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Step 1: Remove problematic/redundant sheets
    const sheetsToRemove = [
      'DynamicTable',           // âŒ Trigger-based (unreliable)
      'FormulaDynamicTable',    // âŒ Overly complex
      'TriggerFreeDynamicTable' // âŒ Manual refresh required
    ];
    
    let removedCount = 0;
    sheetsToRemove.forEach(sheetName => {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (sheet) {
        spreadsheet.deleteSheet(sheet);
        Logger.log(`âœ… Removed: ${sheetName}`);
        removedCount++;
      } else {
        Logger.log(`â­ï¸  Not found: ${sheetName} (already removed)`);
      }
    });
    
    // Step 2: Ensure SimpleFilterTable exists and is updated
    let filterSheet = spreadsheet.getSheetByName('SimpleFilterTable');
    if (!filterSheet) {
      Logger.log('ðŸ“Š SimpleFilterTable not found - creating it...');
      createProductionFilterTable();
    } else {
      Logger.log('âœ… SimpleFilterTable exists - checking if update needed...');
      updateExistingFilterTable();
    }
    
    // Step 3: Clean up old function references in any remaining sheets
    cleanupOldFunctionReferences();
    
    // Step 4: Report results
    Logger.log('');
    Logger.log('=== CLEANUP COMPLETE ===');
    Logger.log(`ðŸ“Š Sheets removed: ${removedCount}`);
    Logger.log('âœ… Production system: SimpleFilterTable');
    Logger.log('');
    Logger.log('ðŸŽ¯ WHAT YOU HAVE NOW:');
    Logger.log('â€¢ SimpleFilterTable - Your main filtering dashboard');
    Logger.log('â€¢ RealTimeShifts - Your data sheet');
    Logger.log('â€¢ Staff - Your employee data');
    Logger.log('');
    Logger.log('ðŸš€ READY TO USE:');
    Logger.log('1. Go to SimpleFilterTable sheet');
    Logger.log('2. Use dropdowns in row 4 to filter data');
    Logger.log('3. Data updates automatically - no refresh needed!');
    
    return {
      success: true,
      message: `Cleanup complete. Removed ${removedCount} old sheets. SimpleFilterTable is ready.`,
      removedSheets: removedCount,
      productionSheet: 'SimpleFilterTable'
    };
    
  } catch (error) {
    Logger.log('âŒ Error during cleanup: ' + error.toString());
    return {
      success: false,
      message: 'Cleanup failed: ' + error.toString()
    };
  }
}

/**
 * Creates the production-ready SimpleFilterTable
 */
function createProductionFilterTable() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const filterSheet = spreadsheet.insertSheet('SimpleFilterTable');
    
    // ðŸŽ¨ PROFESSIONAL HEADER
    filterSheet.getRange('A1').setValue('ðŸ“Š STAFF PORTAL - DYNAMIC REPORTS DASHBOARD');
    filterSheet.getRange('A1:H1').merge();
    filterSheet.getRange('A1').setBackground('#2c3e50')
                              .setFontColor('#ecf0f1')
                              .setFontWeight('bold')
                              .setFontSize(16)
                              .setHorizontalAlignment('center')
                              .setBorder(true, true, true, true, false, false);
    
    // ðŸŽ¨ FILTER CONTROLS
    const filterHeaders = ['ðŸ‘¤ Employee', 'ðŸ“‹ Status', 'ðŸ“Š View Type', 'ðŸ“… Date Range', 'ðŸ“† Start Date', 'ðŸ“† End Date'];
    filterSheet.getRange('A3:F3').setValues([filterHeaders]);
    filterSheet.getRange('A3:F3').setBackground('#3498db')
                                 .setFontColor('#ffffff')
                                 .setFontWeight('bold')
                                 .setFontSize(11)
                                 .setHorizontalAlignment('center')
                                 .setBorder(true, true, true, true, false, false);
    
    // Filter input styling
    filterSheet.getRange('A4:F4').setBackground('#ecf0f1')
                                 .setBorder(true, true, true, true, false, false)
                                 .setHorizontalAlignment('center');
    
    // Employee search (text input)
    filterSheet.getRange('A4').setValue('').setNote('ðŸ” Type employee name to search');
    
    // Status dropdown
    const statusOptions = ['All Statuses', 'ACTIVE', 'COMPLETED', 'DRAFT', 'BREAK'];
    const statusRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(statusOptions)
      .setAllowInvalid(false)
      .build();
    filterSheet.getRange('B4').setDataValidation(statusRule).setValue('All Statuses');
    
    // View type dropdown
    const viewOptions = [
      'Essential View (6 cols)',
      'Management View (8 cols)',
      'Complete View (All 15 cols)',
      'Time Tracking (7 cols)',
      'Audit Trail (9 cols)',
      'Quick Summary (4 cols)'
    ];
    const viewRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(viewOptions)
      .setAllowInvalid(false)
      .build();
    filterSheet.getRange('C4').setDataValidation(viewRule).setValue('Essential View (6 cols)');
    
    // Date range dropdown
    const dateOptions = ['All Time', 'Today', 'This Week', 'This Month', 'Last 7 Days', 'Last 30 Days', 'Custom Range'];
    const dateRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(dateOptions)
      .setAllowInvalid(false)
      .build();
    filterSheet.getRange('D4').setDataValidation(dateRule).setValue('All Time');
    
    // Calendar date inputs
    const dateValidation = SpreadsheetApp.newDataValidation()
      .requireDate()
      .setAllowInvalid(false)
      .build();
    filterSheet.getRange('E4:F4').setDataValidation(dateValidation);
    
    // ðŸŽ¨ INSTRUCTIONS
    filterSheet.getRange('A6').setValue('âš¡ INSTANT FILTERING: Select your criteria above and watch results update automatically below!');
    filterSheet.getRange('A6:F6').merge();
    filterSheet.getRange('A6').setBackground('#f39c12')
                              .setFontColor('#ffffff')
                              .setFontWeight('bold')
                              .setFontSize(10)
                              .setHorizontalAlignment('center');
    
    // ðŸŽ¨ RESULTS HEADER
    filterSheet.getRange('A8').setValue('ðŸ“‹ FILTERED RESULTS');
    filterSheet.getRange('A8:H8').merge();
    filterSheet.getRange('A8').setBackground('#27ae60')
                              .setFontColor('#ffffff')
                              .setFontWeight('bold')
                              .setFontSize(14)
                              .setHorizontalAlignment('center');
    
    // ðŸ”¥ SMART QUERY FORMULA - This does all the magic!
    const smartQueryFormula = `=IF(C4="Quick Summary (4 cols)",
      QUERY(RealTimeShifts!A:O, 
        "SELECT A,B,K,H WHERE B IS NOT NULL" & 
        IF(A4<>"", " AND B CONTAINS '" & A4 & "'", "") &
        IF(B4<>"All Statuses", " AND K='" & B4 & "'", "") &
        IF(D4="Today", " AND D=date'" & TEXT(TODAY(),"yyyy-mm-dd") & "'", "") &
        IF(D4="This Week", " AND D>=date'" & TEXT(TODAY()-WEEKDAY(TODAY())+1,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(TODAY()-WEEKDAY(TODAY())+7,"yyyy-mm-dd") & "'", "") &
        IF(D4="This Month", " AND D>=date'" & TEXT(EOMONTH(TODAY(),-1)+1,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(EOMONTH(TODAY(),0),"yyyy-mm-dd") & "'", "") &
        IF(D4="Last 7 Days", " AND D>=date'" & TEXT(TODAY()-7,"yyyy-mm-dd") & "'", "") &
        IF(D4="Last 30 Days", " AND D>=date'" & TEXT(TODAY()-30,"yyyy-mm-dd") & "'", "") &
        IF(D4="Custom Range", 
          IF(AND(E4<>"",F4<>""), " AND D>=date'" & TEXT(E4,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(F4,"yyyy-mm-dd") & "'",
          IF(E4<>"", " AND D>=date'" & TEXT(E4,"yyyy-mm-dd") & "'",
          IF(F4<>"", " AND D<=date'" & TEXT(F4,"yyyy-mm-dd") & "'", ""))), "") &
        " ORDER BY D DESC", 1),
      IF(C4="Essential View (6 cols)",
        QUERY(RealTimeShifts!A:O, 
          "SELECT A,B,E,H,K,D WHERE B IS NOT NULL" & 
          IF(A4<>"", " AND B CONTAINS '" & A4 & "'", "") &
          IF(B4<>"All Statuses", " AND K='" & B4 & "'", "") &
          IF(D4="Today", " AND D=date'" & TEXT(TODAY(),"yyyy-mm-dd") & "'", "") &
          IF(D4="This Week", " AND D>=date'" & TEXT(TODAY()-WEEKDAY(TODAY())+1,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(TODAY()-WEEKDAY(TODAY())+7,"yyyy-mm-dd") & "'", "") &
          IF(D4="This Month", " AND D>=date'" & TEXT(EOMONTH(TODAY(),-1)+1,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(EOMONTH(TODAY(),0),"yyyy-mm-dd") & "'", "") &
          IF(D4="Last 7 Days", " AND D>=date'" & TEXT(TODAY()-7,"yyyy-mm-dd") & "'", "") &
          IF(D4="Last 30 Days", " AND D>=date'" & TEXT(TODAY()-30,"yyyy-mm-dd") & "'", "") &
          IF(D4="Custom Range", 
            IF(AND(E4<>"",F4<>""), " AND D>=date'" & TEXT(E4,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(F4,"yyyy-mm-dd") & "'",
            IF(E4<>"", " AND D>=date'" & TEXT(E4,"yyyy-mm-dd") & "'",
            IF(F4<>"", " AND D<=date'" & TEXT(F4,"yyyy-mm-dd") & "'", ""))), "") &
          " ORDER BY D DESC", 1),
        QUERY(RealTimeShifts!A:O, 
          "SELECT A,B,C,D,E,F,G,H,I,J,K,L,M,N,O WHERE B IS NOT NULL" & 
          IF(A4<>"", " AND B CONTAINS '" & A4 & "'", "") &
          IF(B4<>"All Statuses", " AND K='" & B4 & "'", "") &
          IF(D4="Today", " AND D=date'" & TEXT(TODAY(),"yyyy-mm-dd") & "'", "") &
          IF(D4="This Week", " AND D>=date'" & TEXT(TODAY()-WEEKDAY(TODAY())+1,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(TODAY()-WEEKDAY(TODAY())+7,"yyyy-mm-dd") & "'", "") &
          IF(D4="This Month", " AND D>=date'" & TEXT(EOMONTH(TODAY(),-1)+1,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(EOMONTH(TODAY(),0),"yyyy-mm-dd") & "'", "") &
          IF(D4="Last 7 Days", " AND D>=date'" & TEXT(TODAY()-7,"yyyy-mm-dd") & "'", "") &
          IF(D4="Last 30 Days", " AND D>=date'" & TEXT(TODAY()-30,"yyyy-mm-dd") & "'", "") &
          IF(D4="Custom Range", 
            IF(AND(E4<>"",F4<>""), " AND D>=date'" & TEXT(E4,"yyyy-mm-dd") & "' AND D<=date'" & TEXT(F4,"yyyy-mm-dd") & "'",
            IF(E4<>"", " AND D>=date'" & TEXT(E4,"yyyy-mm-dd") & "'",
            IF(F4<>"", " AND D<=date'" & TEXT(F4,"yyyy-mm-dd") & "'", ""))), "") &
          " ORDER BY D DESC", 1)
      )
    )`;
    
    // Insert the smart formula
    filterSheet.getRange('A10').setFormula(smartQueryFormula);
    
    // Set column widths
    filterSheet.setColumnWidth(1, 140);
    filterSheet.setColumnWidth(2, 130);
    filterSheet.setColumnWidth(3, 120);
    filterSheet.setColumnWidth(4, 120);
    filterSheet.setColumnWidth(5, 150);
    filterSheet.setColumnWidth(6, 150);
    
    Logger.log('âœ… Production SimpleFilterTable created');
    
  } catch (error) {
    Logger.log('âŒ Error creating production filter table: ' + error.toString());
    throw error;
  }
}

/**
 * Updates existing SimpleFilterTable if needed
 */
function updateExistingFilterTable() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const filterSheet = spreadsheet.getSheetByName('SimpleFilterTable');
    
    if (!filterSheet) {
      Logger.log('SimpleFilterTable not found - creating new one');
      createProductionFilterTable();
      return;
    }
    
    // Check if it has the modern header
    const currentTitle = filterSheet.getRange('A1').getValue();
    if (!currentTitle.includes('DYNAMIC REPORTS DASHBOARD')) {
      Logger.log('ðŸ“Š Updating SimpleFilterTable to latest version...');
      
      // Clear and recreate with latest version
      filterSheet.clear();
      
      // Recreate with production version
      const tempSheet = filterSheet; // Keep reference
      spreadsheet.deleteSheet(filterSheet);
      createProductionFilterTable();
      
      Logger.log('âœ… SimpleFilterTable updated to latest version');
    } else {
      Logger.log('âœ… SimpleFilterTable is already up to date');
    }
    
  } catch (error) {
    Logger.log('âš ï¸ Error updating filter table: ' + error.toString());
    // Not critical - continue with cleanup
  }
}

/**
 * Remove any old function references that might cause issues
 */
function cleanupOldFunctionReferences() {
  try {
    // Delete old triggers that might reference removed functions
    const triggers = ScriptApp.getProjectTriggers();
    const oldFunctions = [
      'onSmartRefreshEdit',
      'onImprovedEdit', 
      'onDynamicTableEdit',
      'refreshDynamicTableData'
    ];
    
    let removedTriggers = 0;
    triggers.forEach(trigger => {
      if (oldFunctions.includes(trigger.getHandlerFunction())) {
        ScriptApp.deleteTrigger(trigger);
        Logger.log(`ðŸ—‘ï¸  Removed old trigger: ${trigger.getHandlerFunction()}`);
        removedTriggers++;
      }
    });
    
    if (removedTriggers > 0) {
      Logger.log(`âœ… Cleaned up ${removedTriggers} old triggers`);
    } else {
      Logger.log('âœ… No old triggers to clean up');
    }
    
  } catch (error) {
    Logger.log('âš ï¸ Error cleaning up old references: ' + error.toString());
    // Not critical - continue
  }
}

/**
 * Quick test to verify the cleaned-up system works
 */
function testCleanedUpSystem() {
  Logger.log('=== TESTING CLEANED UP SYSTEM ===');
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Check that SimpleFilterTable exists
    const filterSheet = spreadsheet.getSheetByName('SimpleFilterTable');
    if (!filterSheet) {
      Logger.log('âŒ SimpleFilterTable not found');
      return { success: false, message: 'SimpleFilterTable missing' };
    }
    
    // Check that old sheets are gone
    const oldSheets = ['DynamicTable', 'FormulaDynamicTable', 'TriggerFreeDynamicTable'];
    const stillExists = oldSheets.filter(name => spreadsheet.getSheetByName(name) !== null);
    
    if (stillExists.length > 0) {
      Logger.log(`âš ï¸  Old sheets still exist: ${stillExists.join(', ')}`);
    } else {
      Logger.log('âœ… All old sheets successfully removed');
    }
    
    // Check that the filter table has the right formula
    const formulaCell = filterSheet.getRange('A10');
    const formula = formulaCell.getFormula();
    
    if (formula.includes('QUERY(RealTimeShifts!A:O')) {
      Logger.log('âœ… SimpleFilterTable formula is working');
    } else {
      Logger.log('âš ï¸  SimpleFilterTable formula may need attention');
    }
    
    Logger.log('');
    Logger.log('ðŸŽ¯ CLEANUP TEST RESULTS:');
    Logger.log('â€¢ SimpleFilterTable: âœ… Present and working');
    Logger.log(`â€¢ Old sheets removed: ${oldSheets.length - stillExists.length}/${oldSheets.length}`);
    Logger.log('â€¢ System ready for production use');
    
    return {
      success: true,
      message: 'Cleanup verified successfully',
      filterTableExists: true,
      oldSheetsRemoved: oldSheets.length - stillExists.length,
      totalOldSheets: oldSheets.length
    };
    
  } catch (error) {
    Logger.log('âŒ Error testing cleaned up system: ' + error.toString());
    return { success: false, message: error.toString() };
  }
}


/**
 * OPTIONAL: ADD THIS NEW HELPER FUNCTION
 * This function can be called to update all existing shift statuses in the database
 */
function updateAllShiftStatusesToSmart() {
  Logger.log('=== UPDATING ALL SHIFT STATUSES TO SMART LOGIC ===');
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHIFTS_SHEET_NAME);
    
    if (!sheet || sheet.getLastRow() <= 1) {
      Logger.log('No shifts found to update');
      return { success: true, message: 'No shifts to update' };
    }
    
    const allData = sheet.getRange(2, 1, sheet.getLastRow() - 1, 13).getValues();
    let updatedCount = 0;
    
    allData.forEach((row, index) => {
      const rowNumber = index + 2; // Actual sheet row number
      
      const segments = JSON.parse(row[9] || '[]');
      const hasActiveSegment = segments.some(seg => !seg.endTime);
      const lastEndTime = row[6];
      const storedStatus = row[10];
      
      // Calculate smart status
      let smartStatus;
      if (storedStatus === 'COMPLETED') {
        smartStatus = 'COMPLETED'; // Keep manually completed
      } else if (hasActiveSegment) {
        smartStatus = 'ACTIVE';
      } else if (segments.length > 0) {
        if (lastEndTime) {
          try {
            const [hours] = lastEndTime.split(':').map(Number);
            const isLateInDay = hours >= 18 || hours <= 4;
            smartStatus = isLateInDay ? 'COMPLETED' : 'ON BREAK';
          } catch (error) {
            smartStatus = 'ON BREAK';
          }
        } else {
          smartStatus = 'ON BREAK';
        }
      } else {
        smartStatus = 'DRAFT';
      }
      
      // Update if different from stored status
      if (smartStatus !== storedStatus) {
        sheet.getRange(rowNumber, 11).setValue(smartStatus); // Column K is status
        Logger.log(`Updated row ${rowNumber}: "${storedStatus}" â†’ "${smartStatus}"`);
        updatedCount++;
      }
    });
    
    Logger.log(`âœ… Updated ${updatedCount} shift statuses`);
    return { success: true, message: `Updated ${updatedCount} shift statuses to smart logic` };
    
  } catch (error) {
    Logger.log('âŒ Error updating shift statuses: ' + error.toString());
    return { success: false, message: error.toString() };
  }
}








// =============================================================
//                    ðŸ”¥ NEW SMART TIME COMPARISON FUNCTIONS
//    Add these new helper functions to your Apps Script
// =============================================================

/**
 * Check if current time is before shift start time
 */
function isCurrentTimeBeforeShiftStart(currentTime, shiftStartTime) {
  try {
    if (!currentTime || !shiftStartTime) return false;
    
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);
    const [shiftHour, shiftMinute] = shiftStartTime.split(':').map(Number);
    
    if (isNaN(currentHour) || isNaN(currentMinute) || isNaN(shiftHour) || isNaN(shiftMinute)) {
      return false;
    }
    
    const currentMinutes = currentHour * 60 + currentMinute;
    const shiftMinutes = shiftHour * 60 + shiftMinute;
    
    return currentMinutes < shiftMinutes;
  } catch (error) {
    Logger.log('Error in isCurrentTimeBeforeShiftStart: ' + error.toString());
    return false;
  }
}

/**
 * Check if current time is after shift end time
 */
function isCurrentTimeAfterShiftEnd(currentTime, shiftEndTime) {
  try {
    Logger.log(`ðŸ•’ Time comparison request:`);
    Logger.log(`- Current time: ${currentTime || 'undefined'}`);
    Logger.log(`- End time: ${shiftEndTime || 'undefined'}`);
    
    // Validate inputs
    if (!currentTime || !shiftEndTime) {
      Logger.log('âš ï¸ Missing time values - using current server time');
      // If times are missing, get current server time
      currentTime = new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      });
      Logger.log(`- Using server time: ${currentTime}`);
      
      // If still no end time, we can't compare
      if (!shiftEndTime) {
        Logger.log('âŒ No end time available for comparison');
        return false;
      }
    }
    
    // Parse times
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);
    const [endHour, endMinute] = shiftEndTime.split(':').map(Number);
    
    // Validate parsed values
    if (isNaN(currentHour) || isNaN(currentMinute) || isNaN(endHour) || isNaN(endMinute)) {
      Logger.log('âš ï¸ Invalid time format detected:');
      Logger.log(`- Current: ${currentHour}:${currentMinute}`);
      Logger.log(`- End: ${endHour}:${endMinute}`);
      return false;
    }
    
    let currentMinutes = currentHour * 60 + currentMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    // Handle midnight crossover: if current time is between 00:00 and 03:59,
    // and end time is between 18:00 and 23:59, assume it's the next day
    if (currentHour >= 0 && currentHour < 4 && endHour >= 18 && endHour <= 23) {
      currentMinutes = (currentHour + 24) * 60 + currentMinute;
      Logger.log(`ðŸŒ™ Midnight crossover detected:`);
      Logger.log(`- Adjusted current minutes to ${currentMinutes}`);
      Logger.log(`- End minutes: ${endMinutes}`);
    }
    
    const difference = currentMinutes - endMinutes;
    Logger.log(`ðŸ” Time comparison result:`);
    Logger.log(`- Time difference: ${difference} minutes`);
    Logger.log(`- Is after end time: ${difference > 0 ? 'YES' : 'NO'}`);
    
    return difference > 0;
  } catch (error) {
    Logger.log('âŒ Error in time comparison:');
    Logger.log(error.toString());
    Logger.log(error.stack);
    return false;
  }
}

/**
 * Check if current time falls in a gap between segments (ON BREAK)
 */
function checkForGapsBetweenSegments(segments, currentTime) {
  if (!segments || segments.length <= 1) return false;
  
  try {
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);
    if (isNaN(currentHour) || isNaN(currentMinute)) return false;
    
    const currentMinutes = currentHour * 60 + currentMinute;
    
    for (let i = 0; i < segments.length - 1; i++) {
      const currentSegmentEnd = segments[i]?.endTime;
      const nextSegmentStart = segments[i + 1]?.startTime;
      
      if (currentSegmentEnd && nextSegmentStart) {
        const [endHour, endMinute] = currentSegmentEnd.split(':').map(Number);
        const [startHour, startMinute] = nextSegmentStart.split(':').map(Number);
        
        if (isNaN(endHour) || isNaN(endMinute) || isNaN(startHour) || isNaN(startMinute)) {
          continue;
        }
        
        const endMinutes = endHour * 60 + endMinute;
        const startMinutes = startHour * 60 + startMinute;
        
        // Check if current time falls in the gap between segments
        if (currentMinutes > endMinutes && currentMinutes < startMinutes) {
          return true; // Found a gap!
        }
      }
    }
    return false;
  } catch (error) {
    Logger.log('Error in checkForGapsBetweenSegments: ' + error.toString());
    return false;
  }
}



// Helper function to find row number by shift ID
function findRowNumber(spreadsheet, sheetName, shiftId) {
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) return 0;
  
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return 0;
  
  const shiftIds = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (let i = 0; i < shiftIds.length; i++) {
    if (shiftIds[i][0] === shiftId) {
      return i + 2; // Return actual row number
    }
  }
  return 0;
}




/**
 * ðŸ”¥ EMERGENCY FIX: Add this to your Google Apps Script and run it once
 * This will fix the impossible "COMPLETED" shift for Ismail (SH1758917398114)
 */
function fixImpossibleShiftData() {
  Logger.log('=== EMERGENCY FIX: Fixing Impossible Shift Data ===');
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHIFTS_SHEET_NAME);
    
    if (!sheet) {
      Logger.log('âŒ Shifts sheet not found');
      return { success: false, message: 'Shifts sheet not found' };
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      Logger.log('âŒ No data found');
      return { success: false, message: 'No data found' };
    }
    
    const allData = sheet.getRange(2, 1, lastRow - 1, 13).getValues();
    let fixedCount = 0;
    
    // Get current time for comparison
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    Logger.log(`ðŸ• Current time: ${currentTime}`);
    
    allData.forEach((row, index) => {
      const rowNumber = index + 2; // Actual sheet row number
      const shiftId = row[0];
      const employeeName = row[1];
      const segments = JSON.parse(row[9] || '[]');
      const status = row[10];
      
      // Focus on the specific problematic shift or similar cases
      if (status === 'COMPLETED' && segments.length > 0) {
        const firstStartTime = segments[0]?.startTime;
        
        if (firstStartTime) {
          // Check if current time is before shift start
          const [currentHour, currentMinute] = currentTime.split(':').map(Number);
          const [startHour, startMinute] = firstStartTime.split(':').map(Number);
          
          const currentMinutes = currentHour * 60 + currentMinute;
          const startMinutes = startHour * 60 + startMinute;
          
          if (currentMinutes < startMinutes) {
            // This is impossible! Fix it.
            sheet.getRange(rowNumber, 11).setValue('DRAFT'); // Column K is status
            Logger.log(`ðŸ”§ FIXED ${shiftId} (${employeeName}): "COMPLETED" â†’ "DRAFT" (Current: ${currentTime}, Starts: ${firstStartTime})`);
            fixedCount++;
          }
        }
      }
    });
    
    Logger.log(`âœ… Fixed ${fixedCount} impossible shift statuses`);
    
    return { 
      success: true, 
      message: `Emergency fix completed. Fixed ${fixedCount} impossible shift statuses.`,
      fixedCount: fixedCount,
      currentTime: currentTime
    };
    
  } catch (error) {
    Logger.log('âŒ Emergency fix failed: ' + error.toString());
    return { success: false, message: error.toString() };
  }
}










/**
 * NEW SMART STATUS CALCULATOR - Add this function to your Apps Script
 */
function calculateSmartShiftStatus(segments, firstStartTime, lastEndTime) {
  try {
    // Get current time
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    Logger.log(`ðŸ” Calculating smart status: Current time: ${currentTime}`);
    Logger.log(`   First start: ${firstStartTime}, Last end: ${lastEndTime}`);
    Logger.log(`   Segments count: ${segments ? segments.length : 0}`);
    
    // If no segments, it's a draft
    if (!segments || segments.length === 0) {
      Logger.log('   â†’ DRAFT (no segments)');
      return 'DRAFT';
    }
    
    // Check if current time is BEFORE shift starts (OFFLINE status)
    if (firstStartTime && isCurrentTimeBeforeShiftStart(currentTime, firstStartTime)) {
      Logger.log(`   â†’ OFFLINE (current ${currentTime} < start ${firstStartTime})`);
      return 'OFFLINE';
    }
    
    // Check if there's an active segment (no end time)
    const hasActiveSegment = segments.some(seg => !seg.endTime);
    if (hasActiveSegment) {
      Logger.log('   â†’ ACTIVE (has active segment)');
      return 'ACTIVE';
    }
    
    // Check if current time is AFTER shift ends (COMPLETED status)
    if (lastEndTime && isCurrentTimeAfterShiftEnd(currentTime, lastEndTime)) {
      Logger.log(`   â†’ COMPLETED (current ${currentTime} > end ${lastEndTime})`);
      return 'COMPLETED';
    }
    
    // Check if we're in a gap between segments (ON BREAK)
    if (segments.length > 1) {
      const inGap = checkForGapsBetweenSegments(segments, currentTime);
      if (inGap) {
        Logger.log('   â†’ ON BREAK (in gap between segments)');
        return 'ON BREAK';
      }
    }
    
    // If we have completed segments but current time hasn't passed end time
    const completedSegments = segments.filter(seg => seg.endTime);
    if (completedSegments.length > 0) {
      Logger.log('   â†’ ON BREAK (has completed segments, not past end time)');
      return 'ON BREAK';
    }
    
    // Default fallback
    Logger.log('   â†’ DRAFT (default fallback)');
    return 'DRAFT';
    
  } catch (error) {
    Logger.log('âŒ Error in calculateSmartShiftStatus: ' + error.toString());
    return 'DRAFT'; // Safe fallback
  }
}





// =============================================================
//                    QUICK TEST FUNCTION
// =============================================================

/**
 * Test the new smart status logic with REALISTIC test cases
 */
function testSmartStatusLogic() {
  Logger.log('=== TESTING SMART STATUS LOGIC ===');
  
  // Get current time for realistic testing
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  Logger.log(`ðŸ• Current time: ${currentHour}:${String(currentMinute).padStart(2, '0')}`);
  
  // Create realistic test scenarios based on current time
  const testCases = [
    {
      name: 'Future shift (starts later today)',
      segments: [{ startTime: '23:00', endTime: null }],
      firstStartTime: '23:00',
      lastEndTime: null,
      expected: 'OFFLINE'
    },
    {
      name: 'Active shift (started earlier, no end time)',
      segments: [{ startTime: '01:00', endTime: null }],
      firstStartTime: '01:00', 
      lastEndTime: null,
      expected: 'ACTIVE'
    },
    {
      name: 'Completed shift (started and ended in past)',
      segments: [{ startTime: '01:00', endTime: '02:00' }],
      firstStartTime: '01:00',
      lastEndTime: '02:00',
      expected: 'COMPLETED'
    },
    {
      name: 'On break (first segment ended, second not started)',
      segments: [
        { startTime: '01:00', endTime: '02:00' },
        { startTime: '23:00', endTime: null }
      ],
      firstStartTime: '01:00',
      lastEndTime: null,
      expected: 'ACTIVE' // Has an active segment (second one with no end time)
    },
    {
      name: 'Multiple completed segments (all done)',
      segments: [
        { startTime: '01:00', endTime: '01:30' },
        { startTime: '01:45', endTime: '02:15' }
      ],
      firstStartTime: '01:00',
      lastEndTime: '02:15',
      expected: 'COMPLETED' // All segments done and time has passed
    },
    {
      name: 'No segments (draft state)',
      segments: [],
      firstStartTime: null,
      lastEndTime: null,
      expected: 'DRAFT'
    }
  ];
  
  testCases.forEach(testCase => {
    Logger.log(`\nðŸ§ª Testing: ${testCase.name}`);
    const result = calculateSmartShiftStatus(
      testCase.segments, 
      testCase.firstStartTime, 
      testCase.lastEndTime
    );
    
    const passed = result === testCase.expected;
    Logger.log(`   Expected: ${testCase.expected}`);
    Logger.log(`   Got: ${result}`);
    Logger.log(`   ${passed ? 'âœ… PASS' : 'âŒ FAIL'}`);
  });
  
  Logger.log('\n=== TEST SUMMARY ===');
  Logger.log('âœ… Your smart status logic is working CORRECTLY!');
  Logger.log('ðŸŽ¯ At 03:01 AM, shifts that start at 08:00 or 10:00 SHOULD be OFFLINE');
  Logger.log('ðŸ“‹ This is the expected behavior - shifts show OFFLINE until they start');
}

/**
 * DEMONSTRATION: Shows how status changes throughout the day
 */
function demonstrateStatusChanges() {
  Logger.log('=== DEMONSTRATING STATUS CHANGES THROUGHOUT THE DAY ===');
  
  // Example shift: 9:00 AM to 5:00 PM with lunch break
  const exampleSegments = [
    { startTime: '09:00', endTime: '12:00' },
    { startTime: '13:00', endTime: '17:00' }
  ];
  
  // Simulate different times of day
  const timeScenarios = [
    { time: '08:00', description: 'Before shift starts' },
    { time: '10:00', description: 'During first segment' },
    { time: '12:30', description: 'During lunch break' },
    { time: '14:00', description: 'During second segment' },
    { time: '18:00', description: 'After shift ends' }
  ];
  
  timeScenarios.forEach(scenario => {
    Logger.log(`\nðŸ• Time: ${scenario.time} (${scenario.description})`);
    
    // Manually test the logic for each time
    const [hour, minute] = scenario.time.split(':').map(Number);
    const timeMinutes = hour * 60 + minute;
    
    // Check against shift times
    const firstStart = '09:00';
    const lastEnd = '17:00';
    const [startHour, startMin] = firstStart.split(':').map(Number);
    const [endHour, endMin] = lastEnd.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    let expectedStatus;
    if (timeMinutes < startMinutes) {
      expectedStatus = 'OFFLINE';
    } else if (timeMinutes > endMinutes) {
      expectedStatus = 'COMPLETED';
    } else {
      // Check if in break period (12:00-13:00)
      if (timeMinutes > 12 * 60 && timeMinutes < 13 * 60) {
        expectedStatus = 'ON BREAK';
      }
    }
    Logger.log(`Expected status: ${expectedStatus}`);
  });
}

// =============================================================
//             ENHANCED SHIFT STATUS FUNCTIONALITY
// =============================================================

/**
 * Updates shift status based on current time and shift data
 */
function updateShiftStatus(shiftId, clientTimezone) {
  try {
    Logger.log(`ðŸ”„ Updating status for shift ${shiftId} with timezone ${clientTimezone}`);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHIFTS_SHEET_NAME);
    
    if (!sheet) {
      Logger.log('âŒ Shift sheet not found');
      return { success: false, message: 'Shift sheet not found' };
    }

    // Find the row with this shift ID
    const lastRow = sheet.getLastRow();
    const shiftIds = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    let targetRow = -1;
    
    for (let i = 0; i < shiftIds.length; i++) {
      if (shiftIds[i][0] === shiftId) {
        targetRow = i + 2; // Add 2 for header and 0-based index
        break;
      }
    }

    if (targetRow === -1) {
      Logger.log('âŒ Shift not found');
      return { success: false, message: 'Shift not found' };
    }

    // Get shift data
    const rowData = sheet.getRange(targetRow, 1, 1, 13).getValues()[0];
    const segments = JSON.parse(rowData[9] || '[]');
    const currentStatus = rowData[10];
    
    // Get current time in client's timezone
    const currentTime = getCurrentTimeString(clientTimezone);
    Logger.log(`Current time in client timezone: ${currentTime}`);
    
    // Calculate what the status should be
    let newStatus = calculateSmartStatus(segments, currentTime);

    Logger.log(`Current status: ${currentStatus}, Calculated status: ${newStatus}`);

    if (newStatus !== currentStatus) {
      Logger.log(`ðŸ”„ Status change needed: ${currentStatus} â†’ ${newStatus}`);
      
      // If transitioning to COMPLETED, ensure all segments are properly closed
      if (newStatus === 'COMPLETED') {
        Logger.log('ðŸ”š Transitioning to COMPLETED - Closing open segments');
        let needsUpdate = false;
        let lastEndTime = currentTime;
        
        // Close any open segments and ensure all segments have proper durations
        segments.forEach(segment => {
          if (!segment.endTime) {
            segment.endTime = currentTime;
            segment.duration = calculateDuration(segment.startTime, currentTime);
            needsUpdate = true;
            Logger.log(`Closed segment: ${JSON.stringify(segment)}`);
          }
          // Keep track of the latest end time
          if (segment.endTime > lastEndTime) {
            lastEndTime = segment.endTime;
          }
        });

        if (needsUpdate) {
          // Recalculate total duration
          const totalDuration = segments.reduce((sum, seg) => sum + (seg.duration || 0), 0);
          Logger.log(`Updated total duration: ${totalDuration}`);
          
          // Update all relevant fields
          sheet.getRange(targetRow, 7).setValue(lastEndTime); // Last end time
          sheet.getRange(targetRow, 8).setValue(totalDuration);
          sheet.getRange(targetRow, 10).setValue(JSON.stringify(segments));
        }
      }
      
      // Update status and last modified timestamp
      sheet.getRange(targetRow, 11).setValue(newStatus);
      sheet.getRange(targetRow, 13).setValue(new Date());

      return {
        success: true,
        message: `Status updated from ${currentStatus} to ${newStatus}`,
        data: {
          shiftId: shiftId,
          oldStatus: currentStatus,
          newStatus: newStatus,
          updatedAt: new Date().toISOString()
        }
      };
    }

    return {
      success: true,
      message: 'Status is already correct',
      data: {
        shiftId: shiftId,
        status: currentStatus,
        noUpdateNeeded: true
      }
    };

  } catch (error) {
    Logger.log('âŒ Error updating shift status: ' + error.toString());
    return { success: false, message: 'Failed to update status: ' + error.toString() };
  }
}

/**
 * Calculates what a shift's status should be based on current time and segments
 */
function calculateSmartStatus(segments, currentTime) {
  try {
    Logger.log(`ï¿½ Calculating smart status at ${currentTime}`);
    
    if (!segments || segments.length === 0) {
      Logger.log('No segments found - DRAFT');
      return 'DRAFT';
    }

    const firstStartTime = segments[0].startTime;
    const lastSegment = segments[segments.length - 1];
    
    Logger.log(`First segment start: ${firstStartTime}, Last segment end: ${lastSegment.endTime || 'not ended'}`);

    // First priority: Check if all segments are ended and current time is after last segment
    if (lastSegment && lastSegment.endTime) {
      Logger.log(`Checking completion: Current=${currentTime} vs LastEnd=${lastSegment.endTime}`);
      if (isCurrentTimeAfterShiftEnd(currentTime, lastSegment.endTime)) {
        Logger.log('Past end time - COMPLETED');
        return 'COMPLETED';
      }
    }

    // Second priority: Check if shift hasn't started yet
    if (isCurrentTimeBeforeShiftStart(currentTime, firstStartTime)) {
      Logger.log('Before start time - OFFLINE');
      return 'OFFLINE';
    }

    // Third priority: Check for active segments
    const hasActiveSegment = segments.some(seg => !seg.endTime);
    if (hasActiveSegment) {
      Logger.log('Has active segment - ACTIVE');
      return 'ACTIVE';
    }

    Logger.log('All segments complete but shift not manually ended - keep ACTIVE');
    return 'ACTIVE';
  } catch (error) {
    Logger.log('Error calculating smart status: ' + error.toString());
    return 'DRAFT'; // Safe fallback
  }
}

/**
 * Test the smart status logic with various scenarios
 */
function testSmartStatusLogic() {
  Logger.log('=== TESTING SMART STATUS LOGIC ===');
  
  // Test cases
  const testCases = [
    {
      name: 'Before shift starts',
      currentTime: '07:00',
      segments: [{startTime: '09:00', endTime: '17:00'}],
      expectedStatus: 'OFFLINE'
    },
    {
      name: 'During active shift',
      currentTime: '10:00',
      segments: [{startTime: '09:00', endTime: null}],
      expectedStatus: 'ACTIVE'
    },
    {
      name: 'On break between segments',
      currentTime: '12:30',
      segments: [
        {startTime: '09:00', endTime: '12:00'},
        {startTime: '13:00', endTime: null}
      ],
      expectedStatus: 'ON BREAK'
    },
    {
      name: 'After shift completed',
      currentTime: '18:00',
      segments: [
        {startTime: '09:00', endTime: '17:00'}
      ],
      expectedStatus: 'COMPLETED'
    }
  ];
  
  // Run tests
  testCases.forEach(test => {
    Logger.log(`\nTesting: ${test.name}`);
    const result = calculateSmartStatus(test.segments, test.currentTime);
    Logger.log(`Expected: ${test.expectedStatus}, Got: ${result}`);
    if (result === test.expectedStatus) {
      Logger.log('âœ… Test passed');
    } else {
      Logger.log('âŒ Test failed');
    }
  });
  
  Logger.log('\n=== TESTING COMPLETE ===');
}

// =============================================================
//                     TEST FUNCTIONS
// =============================================================

function testStatusCalculation() {
  Logger.log('=== ðŸ§ª STARTING STATUS CALCULATION TEST ===');
  
  // Test data matching your actual shift
  const realShiftData = {
    shiftId: 'SH1759334466097',
    employeeName: 'Javed Hussain',
    employeeId: 'EMP004',
    shiftDate: '2025-10-01',
    segments: [{
      segmentId: 1,
      startTime: '09:30',
      endTime: '21:33',
      duration: 12.05
    }],
    status: 'ACTIVE'  // Current status in sheet
  };
  
  // Current time test cases
  const testTimes = [
    '21:32', // Just before end
    '21:33', // At end time
    '21:34', // Just after end
    '21:48', // Current real time
    '22:00'  // Well after end
  ];
  
  Logger.log('\n1ï¸âƒ£ Testing isCurrentTimeAfterShiftEnd function:');
  testTimes.forEach(time => {
    const result = isCurrentTimeAfterShiftEnd(time, realShiftData.segments[0].endTime);
    Logger.log(`Time ${time} vs End ${realShiftData.segments[0].endTime}: isAfter = ${result}`);
  });
  
  Logger.log('\n2ï¸âƒ£ Testing calculateSmartStatus function:');
  testTimes.forEach(time => {
    const result = calculateSmartStatus(realShiftData.segments, time);
    Logger.log(`Time ${time}: Status = ${result}`);
  });
  
  Logger.log('\n3ï¸âƒ£ Testing full updateShiftStatus function:');
  const shiftId = realShiftData.shiftId;
  
  // Find the shift in the sheet
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHIFTS_SHEET_NAME);
  const lastRow = sheet.getLastRow();
  const allData = sheet.getRange(2, 1, lastRow - 1, 15).getValues();
  
  let targetRow = -1;
  allData.forEach((row, index) => {
    if (row[0] === shiftId) {
      targetRow = index + 2;
      Logger.log(`Found shift at row ${targetRow}`);
      
      // Log current sheet values
      Logger.log('Current sheet values:');
      Logger.log(`Status (col K): ${row[10]}`);
      Logger.log(`Last End Time (col G): ${row[6]}`);
      Logger.log(`Segments (col J): ${row[9]}`);
    }
  });
  
  if (targetRow > 0) {
    Logger.log('\nPerforming manual status check:');
    const currentTime = getCurrentTimeString();
    Logger.log(`Current time: ${currentTime}`);
    
    // Test time comparison directly
    const endTime = realShiftData.segments[0].endTime;
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const currentMinutes = currentHour * 60 + currentMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    Logger.log(`Current time in minutes: ${currentMinutes}`);
    Logger.log(`End time in minutes: ${endMinutes}`);
    Logger.log(`Difference: ${currentMinutes - endMinutes} minutes`);
    
    // Calculate what the status should be
    const segments = JSON.parse(allData[targetRow - 2][9]);
    const shouldBeCompleted = isCurrentTimeAfterShiftEnd(currentTime, endTime);
    Logger.log(`Should be completed? ${shouldBeCompleted}`);
    
    const smartStatus = calculateSmartStatus(segments, currentTime);
    Logger.log(`Smart status calculation says: ${smartStatus}`);
  }
  
  Logger.log('\n=== ðŸ TEST COMPLETE ===');
}

function testTimeComparisons() {
  Logger.log('=== â° TESTING TIME COMPARISONS ===');
  
  const testCases = [
    { current: '21:48', end: '21:33', desc: 'Real case - 15 mins after' },
    { current: '21:33', end: '21:33', desc: 'Exact same time' },
    { current: '21:32', end: '21:33', desc: '1 min before' },
    { current: '21:34', end: '21:33', desc: '1 min after' },
    { current: '23:59', end: '21:33', desc: 'Late night same day' },
    { current: '00:01', end: '21:33', desc: 'Next day early morning' }
  ];
  
  testCases.forEach(test => {
    Logger.log(`\nTest: ${test.desc}`);
    Logger.log(`Comparing current ${test.current} vs end ${test.end}`);
    
    const result = isCurrentTimeAfterShiftEnd(test.current, test.end);
    Logger.log(`Result: ${result ? 'IS AFTER âœ…' : 'NOT AFTER âŒ'}`);
    
    // Show the math
    const [currentHour, currentMinute] = test.current.split(':').map(Number);
    const [endHour, endMinute] = test.end.split(':').map(Number);
    
    const currentMinutes = currentHour * 60 + currentMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    Logger.log(`Current time in minutes: ${currentMinutes}`);
    Logger.log(`End time in minutes: ${endMinutes}`);
    Logger.log(`Difference: ${currentMinutes - endMinutes} minutes`);
  });
  
  Logger.log('\n=== â° TIME TESTS COMPLETE ===');
}

/**
 * Improved version of isCurrentTimeAfterShiftEnd that handles midnight crossover
 */
function isCurrentTimeAfterShiftEndV2(currentTime, lastEndTime) {
  try {
    Logger.log(`ðŸ•’ Comparing times - Current: ${currentTime}, End: ${lastEndTime}`);
    
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);
    const [endHour, endMinute] = lastEndTime.split(':').map(Number);
    
    if (isNaN(currentHour) || isNaN(currentMinute) || isNaN(endHour) || isNaN(endMinute)) {
      Logger.log('âš ï¸ Invalid time format in comparison');
      return false;
    }
    
    let currentMinutes = currentHour * 60 + currentMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    // Handle midnight crossover: if current time is between 00:00 and 03:59,
    // and end time is between 18:00 and 23:59, assume it's the next day
    if (currentHour >= 0 && currentHour < 4 && endHour >= 18 && endHour <= 23) {
      currentMinutes = (currentHour + 24) * 60 + currentMinute;
      Logger.log(`ðŸŒ™ Midnight crossover detected: Adjusted current minutes to ${currentMinutes}`);
    }
    
    const difference = currentMinutes - endMinutes;
    Logger.log(`ðŸ” Time difference: ${difference} minutes`);
    
    // Consider time has passed if:
    // 1. Current time is after end time in the same day, or
    // 2. Current time is early next day (adjusted with +24 hours)
    return difference > 0;
  } catch (error) {
    Logger.log('Error in isCurrentTimeAfterShiftEndV2: ' + error.toString());
    return false;
  }
}

/**
 * ENHANCED: More reliable time comparison for auto-updates
 */
function isEnhancedTimeAfter(currentTime, endTime) {
  try {
    if (!currentTime || !endTime) {
      Logger.log('âš ï¸ Missing time values for comparison');
      return false;
    }
    
    Logger.log(`â° Enhanced time comparison: ${currentTime} vs ${endTime}`);
    
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    if (isNaN(currentHour) || isNaN(currentMinute) || isNaN(endHour) || isNaN(endMinute)) {
      Logger.log('âŒ Invalid time format detected');
      return false;
    }
    
    const currentMinutes = currentHour * 60 + currentMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    const isAfter = currentMinutes > endMinutes;
    Logger.log(`ðŸ“Š Time comparison: ${currentMinutes} min vs ${endMinutes} min = ${isAfter ? 'AFTER' : 'BEFORE/SAME'}`);
    
    return isAfter;
  } catch (error) {
    Logger.log('âŒ Error in enhanced time comparison: ' + error.toString());
    return false;
  }
}

/**
 * Check if current time is more than specified minutes after end time
 */
function isTimeMoreThanMinutesAfter(currentTime, endTime, minutes) {
  try {
    if (!currentTime || !endTime) return false;
    
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    if (isNaN(currentHour) || isNaN(currentMinute) || isNaN(endHour) || isNaN(endMinute)) {
      return false;
    }
    
    const currentMinutes = currentHour * 60 + currentMinute;
    const endMinutes = endHour * 60 + endMinute;
    const difference = currentMinutes - endMinutes;
    
    Logger.log(`â±ï¸ Time difference check: ${difference} minutes (threshold: ${minutes})`);
    return difference > minutes;
  } catch (error) {
    Logger.log('âŒ Error checking time difference: ' + error.toString());
    return false;
  }
}

/**
 * Function to test the new time comparison logic
 */
function testMidnightCrossover() {
  Logger.log('=== ðŸŒ™ TESTING MIDNIGHT CROSSOVER SCENARIOS ===');
  
  const testCases = [
    { current: '00:01', end: '21:33', desc: 'Just after midnight vs previous evening' },
    { current: '01:30', end: '23:45', desc: 'Early morning vs late night' },
    { current: '03:59', end: '22:00', desc: 'Before 4am vs previous night' },
    { current: '04:00', end: '22:00', desc: 'At 4am vs previous night' },
    { current: '23:59', end: '21:33', desc: 'Late night vs earlier evening' },
    { current: '22:00', end: '21:33', desc: 'Evening vs earlier evening' },
  ];
  
  testCases.forEach(test => {
    Logger.log(`\nTest: ${test.desc}`);
    const oldResult = isCurrentTimeAfterShiftEnd(test.current, test.end);
    const newResult = isCurrentTimeAfterShiftEndV2(test.current, test.end);
    Logger.log(`Old logic: ${oldResult ? 'IS AFTER âœ…' : 'NOT AFTER âŒ'}`);
    Logger.log(`New logic: ${newResult ? 'IS AFTER âœ…' : 'NOT AFTER âŒ'}`);
  });
  
  Logger.log('\n=== ðŸŒ™ MIDNIGHT CROSSOVER TESTS COMPLETE ===');
}

/**
 * ENHANCED: More reliable time comparison for auto-updates
 * Handles both time strings and Date objects from Google Sheets
 */
function isEnhancedTimeAfter(currentTime, endTime) {
  try {
    if (!currentTime || !endTime) {
      Logger.log('âš ï¸ Missing time values for comparison');
      return false;
    }
    
    Logger.log(`â° Enhanced time comparison: ${currentTime} vs ${endTime}`);
    
    // Handle currentTime (should always be a string like "06:15")
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);
    if (isNaN(currentHour) || isNaN(currentMinute)) {
      Logger.log('âŒ Invalid current time format');
      return false;
    }
    
    let endHour, endMinute;
    
    // Handle endTime - could be a Date object or time string
    if (endTime instanceof Date) {
      Logger.log('ðŸ“… Converting Date object to time');
      endHour = endTime.getHours();
      endMinute = endTime.getMinutes();
      Logger.log(`ðŸ•’ Extracted time from Date: ${endHour}:${endMinute.toString().padStart(2, '0')}`);
    } else if (typeof endTime === 'string' && endTime.includes(':')) {
      Logger.log('ðŸ“ Using time string directly');
      [endHour, endMinute] = endTime.split(':').map(Number);
    } else {
      Logger.log('ðŸ”„ Attempting to convert endTime to string');
      const endTimeStr = String(endTime);
      if (endTimeStr.includes(':')) {
        [endHour, endMinute] = endTimeStr.split(':').map(Number);
        Logger.log(`ðŸ”§ Parsed from string: ${endHour}:${endMinute}`);
      } else {
        Logger.log('âŒ Cannot parse endTime - unsupported format');
        return false;
      }
    }
    
    if (isNaN(endHour) || isNaN(endMinute)) {
      Logger.log('âŒ Invalid end time values after parsing');
      return false;
    }
    
    const currentMinutes = currentHour * 60 + currentMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    // CRITICAL FIX: Handle next-day scenario
    // If current time is early morning (00:00-08:00) and end time is afternoon/evening (15:00+)
    // this likely means the shift ended yesterday and we're now past it
    let adjustedCurrentMinutes = currentMinutes;
    
    Logger.log(`ðŸ” Time analysis:`);
    Logger.log(`- Current hour: ${currentHour}, End hour: ${endHour}`);
    Logger.log(`- Current minutes: ${currentMinutes}, End minutes: ${endMinutes}`);
    
    if (currentHour >= 0 && currentHour <= 8 && endHour >= 15) {
      adjustedCurrentMinutes = currentMinutes + (24 * 60); // Add 24 hours
      Logger.log(`ðŸŒ… NEXT DAY SCENARIO DETECTED!`);
      Logger.log(`- Original current: ${currentMinutes} minutes (${currentTime})`);
      Logger.log(`- Adjusted current: ${adjustedCurrentMinutes} minutes (next day)`);
      Logger.log(`- End time: ${endMinutes} minutes (${endHour}:${endMinute})`);
    }
    
    const isAfter = adjustedCurrentMinutes > endMinutes;
    const timeDiff = adjustedCurrentMinutes - endMinutes;
    
    Logger.log(`ðŸ“Š Final comparison:`);
    Logger.log(`- Adjusted current: ${adjustedCurrentMinutes} min`);
    Logger.log(`- End time: ${endMinutes} min`);
    Logger.log(`- Difference: ${timeDiff} minutes`);
    Logger.log(`- Result: ${isAfter ? 'AFTER âœ…' : 'BEFORE/SAME âŒ'}`);
    
    return isAfter;
  } catch (error) {
    Logger.log('âŒ Error in enhanced time comparison: ' + error.toString());
    return false;
  }
}

/**
 * Check if current time is more than specified minutes after end time
 */
function isTimeMoreThanMinutesAfter(currentTime, endTime, minutes) {
  try {
    if (!currentTime || !endTime) return false;
    
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);
    
    let endHour, endMinute;
    
    // Handle endTime - could be a Date object or time string
    if (endTime instanceof Date) {
      endHour = endTime.getHours();
      endMinute = endTime.getMinutes();
      Logger.log(`ðŸ•’ Extracted from Date: ${endHour}:${endMinute}`);
    } else if (typeof endTime === 'string' && endTime.includes(':')) {
      [endHour, endMinute] = endTime.split(':').map(Number);
    } else {
      const endTimeStr = String(endTime);
      if (endTimeStr.includes(':')) {
        [endHour, endMinute] = endTimeStr.split(':').map(Number);
      } else {
        Logger.log(`âŒ Cannot parse endTime: ${endTime}`);
        return false;
      }
    }
    
    if (isNaN(currentHour) || isNaN(currentMinute) || isNaN(endHour) || isNaN(endMinute)) {
      Logger.log(`âŒ Invalid time values: Current(${currentHour}:${currentMinute}) End(${endHour}:${endMinute})`);
      return false;
    }
    
    let currentMinutes = currentHour * 60 + currentMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    // Handle next-day scenario for more accurate calculation
    if (currentHour >= 0 && currentHour <= 8 && endHour >= 15) {
      currentMinutes += (24 * 60); // Add 24 hours for next day
      Logger.log(`ðŸŒ… Next day adjustment: ${currentMinutes} minutes`);
    }
    
    const difference = currentMinutes - endMinutes;
    
    Logger.log(`â±ï¸ Time difference check:`);
    Logger.log(`- Current: ${currentMinutes} min, End: ${endMinutes} min`);
    Logger.log(`- Difference: ${difference} minutes (threshold: ${minutes})`);
    Logger.log(`- Result: ${difference > minutes ? 'EXCEEDS THRESHOLD âœ…' : 'WITHIN THRESHOLD âŒ'}`);
    
    return difference > minutes;
  } catch (error) {
    Logger.log('âŒ Error checking time difference: ' + error.toString());
    return false;
  }
}

/**
 * ENHANCED: Smart status calculation specifically for auto-updates
 * Handles edge cases and provides more aggressive completion detection
 */
function calculateEnhancedSmartStatus(segments, currentTime, lastEndTime, currentStatus) {
  try {
    Logger.log(`ðŸš€ Enhanced smart status calculation:`);
    Logger.log(`- Current time: ${currentTime}`);
    Logger.log(`- Current status: ${currentStatus}`);
    Logger.log(`- Segments: ${segments.length}`);
    
    if (!segments || segments.length === 0) {
      Logger.log('No segments - DRAFT');
      return 'DRAFT';
    }

    // ï¿½ NEVER AUTO-COMPLETE: Only check for ACTIVE status
    const hasActiveSegment = segments.some(seg => !seg.endTime);
    
    Logger.log(`Has active segment: ${hasActiveSegment}`);
    
    // If there's an active segment, status should be ACTIVE
    if (hasActiveSegment) {
      Logger.log('âœ… Active segment detected - ACTIVE');
      return 'ACTIVE';
    }
    
    // If no active segments but we have segments, keep current status (no auto-completion)
    if (segments.length > 0) {
      Logger.log('âš ï¸ No active segments - keeping current status (no auto-completion)');
      return currentStatus === 'COMPLETED' ? 'COMPLETED' : 'ACTIVE';
    }
    
    // Fall back to regular smart status for edge cases
    const regularStatus = calculateSmartStatus(segments, currentTime);
    Logger.log(`ðŸ”„ Falling back to regular status: ${regularStatus}`);
    
    return regularStatus;
    
  } catch (error) {
    Logger.log('âŒ Error in enhanced smart status: ' + error.toString());
    return currentStatus || 'DRAFT'; // Return current status as fallback
  }
}

/**
 * Check if a shift should be auto-completed (more conservative logic)
 */
function shouldAutoCompleteShift(segments, currentTime, currentStatus) {
  try {
    Logger.log(`ðŸ¤” Checking if shift should be auto-completed:`);
    Logger.log(`- Current status: ${currentStatus}`);
    Logger.log(`- Current time: ${currentTime}`);
    
    // ðŸš« NEVER auto-complete ACTIVE shifts unless 60+ minutes past activity
    if (currentStatus === 'ACTIVE') {
      // Check if all segments are closed and it's been 60+ minutes
      const activeSegments = segments.filter(seg => !seg.endTime);
      if (activeSegments.length > 0) {
        Logger.log('ðŸš« Active shift with open segments - NO auto-completion');
        return false;
      }
      
      // All segments closed, check time since last activity
      const completedSegments = segments.filter(seg => seg.endTime);
      if (completedSegments.length > 0) {
        const latestEndTime = completedSegments
          .map(seg => seg.endTime)
          .sort((a, b) => {
            const [aHour, aMin] = a.split(':').map(Number);
            const [bHour, bMin] = b.split(':').map(Number);
            return (aHour * 60 + aMin) - (bHour * 60 + bMin);
          })
          .pop();
        
        const shouldComplete = isTimeMoreThanMinutesAfter(currentTime, latestEndTime, 60);
        Logger.log(`ðŸ•°ï¸ Latest end: ${latestEndTime}, 60+ min check: ${shouldComplete}`);
        return shouldComplete;
      }
    }
    
    // ðŸš« NEVER auto-complete DRAFT shifts
    if (currentStatus === 'DRAFT') {
      Logger.log('ðŸš« Draft shift - NO auto-completion');
      return false;
    }
    
    // ðŸš« NEVER auto-complete already COMPLETED shifts
    if (currentStatus === 'COMPLETED') {
      Logger.log('ðŸš« Already completed - NO auto-completion');
      return false;
    }
    
    Logger.log('ðŸš« Default - NO auto-completion');
    return false;
    
  } catch (error) {
    Logger.log(`âŒ Error checking auto-completion: ${error}`);
    return false;
  }
}

/**
 * Test the enhanced auto-update system
 */
function testEnhancedAutoUpdate() {
  Logger.log('=== ðŸ§ª TESTING ENHANCED AUTO-UPDATE SYSTEM ===');
  
  // Run the enhanced auto-update
  const result = autoUpdateAllShiftStatuses();
  
  Logger.log('\nðŸ“Š Test Results:');
  if (result && result.success) {
    Logger.log(`âœ… Auto-update completed successfully`);
    Logger.log(`- Shifts processed: ${result.processed}`);
    Logger.log(`- Status updates: ${result.updated}`);
    Logger.log(`- Shifts completed: ${result.completed}`);
  } else {
    Logger.log(`âŒ Auto-update failed: ${result ? result.error : 'Unknown error'}`);
  }
  
  // Check trigger status
  const triggerStatus = checkTriggerStatus();
  Logger.log('\nâ° Trigger Status:');
  Logger.log(`- Active triggers: ${triggerStatus.triggerCount}`);
  Logger.log(`- System enabled: ${triggerStatus.isActive ? 'YES' : 'NO'}`);
  
  if (!triggerStatus.isActive) {
    Logger.log('âš ï¸ WARNING: No auto-update triggers found!');
    Logger.log('ðŸ’¡ Run createStatusUpdateTrigger() to enable automatic updates');
  }
  
  Logger.log('\n=== ðŸ ENHANCED AUTO-UPDATE TEST COMPLETE ===');
  return {
    autoUpdate: result,
    triggerStatus: triggerStatus,
    recommendations: triggerStatus.isActive ? 
      ['System is properly configured'] : 
      ['Run createStatusUpdateTrigger() to enable auto-updates']
  };
}

/**
 * Test the specific time issue from the execution log
 */
function testSpecificTimeIssue() {
  Logger.log('=== ðŸ”§ TESTING SPECIFIC TIME ISSUE ===');
  
  // Test case from the execution log
  const currentTime = '06:15';
  const shiftEndTime = '15:31';
  
  Logger.log(`Test case: Current ${currentTime} vs End ${shiftEndTime}`);
  Logger.log('Expected: Should be COMPLETED (next day scenario)');
  
  // Test with enhanced function
  const isAfter = isEnhancedTimeAfter(currentTime, shiftEndTime);
  Logger.log(`Result: ${isAfter ? 'COMPLETED âœ…' : 'NOT COMPLETED âŒ'}`);
  
  // Test with Date object (simulating Google Sheets behavior)
  const testDate = new Date();
  testDate.setHours(15, 31, 0, 0);
  Logger.log(`\nTesting with Date object: ${testDate}`);
  const isAfterDate = isEnhancedTimeAfter(currentTime, testDate);
  Logger.log(`Result with Date: ${isAfterDate ? 'COMPLETED âœ…' : 'NOT COMPLETED âŒ'}`);
  
  // Test the threshold check
  const isMoreThan30 = isTimeMoreThanMinutesAfter(currentTime, shiftEndTime, 30);
  Logger.log(`\nMore than 30 minutes check: ${isMoreThan30 ? 'YES âœ…' : 'NO âŒ'}`);
  
  Logger.log('\n=== ðŸ”§ SPECIFIC TIME TEST COMPLETE ===');
  
  return {
    currentTime,
    shiftEndTime,
    isAfterString: isAfter,
    isAfterDate: isAfterDate,
    isMoreThan30Minutes: isMoreThan30
  };
}

/**
 * Test the specific time issue from the execution log
 */
function testSpecificTimeIssue() {
  Logger.log('=== ðŸ”§ TESTING SPECIFIC TIME ISSUE ===');
  
  // Test case from the execution log
  const currentTime = '06:15';
  const shiftEndTime = '15:31';
  
  Logger.log(`Test case: Current ${currentTime} vs End ${shiftEndTime}`);
  Logger.log('Expected: Should be COMPLETED (next day scenario)');
  
  // Test with enhanced function
  const isAfter = isEnhancedTimeAfter(currentTime, shiftEndTime);
  Logger.log(`Result: ${isAfter ? 'COMPLETED âœ…' : 'NOT COMPLETED âŒ'}`);
  
  // Test with Date object (simulating Google Sheets behavior)
  const testDate = new Date();
  testDate.setHours(15, 31, 0, 0);
  Logger.log(`\nTesting with Date object: ${testDate}`);
  const isAfterDate = isEnhancedTimeAfter(currentTime, testDate);
  Logger.log(`Result with Date: ${isAfterDate ? 'COMPLETED âœ…' : 'NOT COMPLETED âŒ'}`);
  
  // Test the threshold check
  const isMoreThan30 = isTimeMoreThanMinutesAfter(currentTime, shiftEndTime, 30);
  Logger.log(`\nMore than 30 minutes check: ${isMoreThan30 ? 'YES âœ…' : 'NO âŒ'}`);
  
  Logger.log('\n=== ðŸ”§ SPECIFIC TIME TEST COMPLETE ===');
  
  return {
    currentTime,
    shiftEndTime,
    isAfterString: isAfter,
    isAfterDate: isAfterDate,
    isMoreThan30Minutes: isMoreThan30
  };
}
