chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.txt === "start") {
        function trim(Element) {
            Element = Element.replace(/(?:^[\s\u00a0]+)|(?:[\s\u00a0]+$)/g, ""); //essentially a trim()
            return Element;
        }

        //getting student info
        var name = trim(document.getElementsByClassName("stuName")[0].innerText);
        var container = document.getElementsByClassName("flexDiv");
        var rollNo = container[0].getElementsByTagName("span")[0];
        rollNo = trim(rollNo.innerText);
        var branch = container[1].children[0].getElementsByTagName("span")[0];
        branch = trim(branch.innerText);
        var studentType = container[1].children[1].getElementsByTagName("span")[0];
        studentType = trim(studentType.innerText);

        let semester = document.getElementsByClassName("subCnt");

        var courseInfo = [];
        var studentInfo = [];

        var courseCodes = [];

        studentInfo.push({
            Name: name,
            RollNo: rollNo,
            Branch: branch,
            StudentType: studentType,
        });

        var numberGrades = {
            "A+": 10,
            "A": 10,
            "A-": 9,
            "B": 8,
            "B-": 7,
            "C": 6,
            "C-": 5,
            "D": 4,
            "FR": 0,
            "FS": 0,
            "S": -1,
            "I": -1
        };

        //for (j = semester.length - 1; j >= 0; j--) {
        for (j = 0; j < semester.length; j++) {
            let courses = semester[j].getElementsByClassName(
                "hierarchyLi dataLi tab_body_bg"
            );
            var currentSem = semester.length - j;

            for (i = 0; i < courses.length; i++) {
                if (courses[i].children[7] != undefined) {

                    //checking if the current course code appears multiple times (as backlogs or improvements)

                    var currentCode = courses[i].children[0].innerText

                    if (courseCodes.indexOf(currentCode) == -1) {
                        courseCodes.push(currentCode);

                        CourseCode = trim(courses[i].children[0].innerText);
                        CourseName = trim(courses[i].children[1].innerText);
                        CourseCredits = trim(courses[i].children[2].innerText);
                        RegType = trim(courses[i].children[3].innerText);
                        CourseType = trim(courses[i].children[4].innerText);
                        CourseGrade = trim(courses[i].children[7].innerText);

                        if (CourseGrade != "") numGrade = numberGrades[CourseGrade];
                        else if (CourseGrade == "")
                        //courses without a grade yet
                            numGrade = -2;

                        courseInfo.push({
                            Semester: currentSem,
                            Code: CourseCode,
                            Course: CourseName,
                            Credits: CourseCredits,
                            Reg: RegType,
                            Type: CourseType,
                            Grade: CourseGrade,
                            NumberGrade: numGrade,
                        });
                    }
                    //sowie, pls no kill me
                    courses[i].children[7].innerText = " FR";
                    courses[i].children[7].style.color = "red";
                }

            }
        }

        //sending student and course information to background.js
        chrome.runtime.sendMessage({
            S_info: studentInfo,
            C_info: courseInfo,
        });
    }
});