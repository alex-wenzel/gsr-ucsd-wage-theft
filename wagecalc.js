// Populate with program information
// harcoded here to avoid needing server infrastructure of any kind

// https://www.ucop.edu/academic-personnel-programs/_files/2022-23/april-2023-ase-gsr-postoc-salary-scales/t22.pdf
const nWorkers = {
	"BISB": 87,
	"BIO_GSR": 385,
	"BIOE": 418,
	"BMS": 172,
	"NEURO": 100,
	"CHEM": 366,
	"SIO_PRE": 352
}

const oldCompSteps = {
	"1": 22005.50,
	"2": 23717.50,
	"3": 26302.00,
	"4": 28409.00,
	"5": 30299.50,
	"6": 31706.00,
	"7": 34246.00,
	"8": 36970.50,
	"9": 39936.50,
	"10": 43119.50
}

const april1CompSteps = {
	"1": 30540.00,
	"2": 32907.00,
	"3": 35457.50,
	"4": 38205.50,
	"5": 41166.50,
	"6": 44357.00
}

const programCompInfo = {
	"BISB": {
		"name": "Bioinformatics & Systems Biology",
		"old_step": "9",
		"april1_step": "6",
		"old_percent": 41.74,
		"april1_percent": 43.00,
		"got_april1_raise": true
	},

	"BIO_TF": {
		"name": "Biology (Trainees & Fellows)",
		"old_step": "10",
		"april1_step": "6",
		"old_percent": 41.74,
		"april1_percent": 41.74,
		"got_april1_raise": false
	},

	"BIO_GSR": {
		"name": "Biology (Not Fellow or Trainee)",
		"old_step": "10",
		"april1_step": "6",
		"old_percent": 41.74,
		"april1_percent": 41.74,
		"got_april1_raise": true
	},

	"BIOE": {
		"name": "Bioengineering",
		"old_step": "9",
		"april1_step": "6",
		"old_percent": 45.00,
		"april1_percent": 45.00,
		"got_april1_raise": true
	},

	"BMS": {
		"name": "Biomedical Science",
		"old_step": "10",
		"april1_step": "6",
		"old_percent": 41.74,
		"april1_percent": 43.00,
		"got_april1_raise": true
	},

	"NEURO": {
		"name": "Neuroscience",
		"old_step": "10",
		"april1_step": "6",
		"old_percent": 41.74,
		"april1_percent": 43.00,
		"got_april1_raise": true
	},

	"CHEM": {
		"name": "Chemistry",
		"old_step": "10",
		"april1_step": "6",
		"old_percent": 39.42,
		"april1_percent": 39.42,
		"got_april1_raise": true
	},

	"SIO_PRE": {
		"name": "Scripps Institute of Oceanography (Pre-Candidacy)",
		"old_step": "10",
		"april1_step": "6",
		"old_percent": 40.00,
		"april1_percent": 40.00,
		"got_april1_raise": true
	},

	"SIO_POST": {
		"name": "Scripps Institute of Oceanography (Post-Candidacy)",
		"old_step": "10",
		"april1_step": "6",
		"old_percent": 40.00,
		"april1_percent": 43.00,
		"got_april1_raise": true
	},

	"STRUC": {
		"name": "Structural Engineering",
		"old_step": "7",
		"april1_step": "4",
		"old_percent": 49.00,
		"april1_percent": 49.00,
		"got_april1_raise": true
	}
}

var selectProgram  = document.getElementById("selectProgram");

for (const [program, info] of Object.entries(programCompInfo)) {
	var new_option = document.createElement("option");
	new_option.textContent = info["name"];
	new_option.value = program;
	selectProgram.options.add(new_option);
}


// https://bobbyhadz.com/blog/javascript-get-number-of-months-between-two-dates#get-the-number-of-months-between-2-dates-in-javascript
function getMonthDifference(startDate, endDate) {
	return (
 		endDate.getMonth() -
		startDate.getMonth() +
		12 * (endDate.getFullYear() - startDate.getFullYear())
	);
}

// https://stackoverflow.com/questions/38446725/get-number-of-days-in-the-current-month-using-javascript
function getDaysInThisMonth() {
	var now = new Date();
	return new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
}

function computeMissingWages(progName) {
	// today's date in PST
	const now = new Date(Date.now()) //.toLocaleDateString('us-PT')

	// ratification date
	const ratDay = new Date(2022, 12, 23)

	// jan 1st
	const jan1 = new Date(2023, 1, 1)

	// april 1st
	const apr1 = new Date(2023, 4, 1)

	// fraction of month in December post ratification on 12/23/2022
	const partialDec2022 = 8.0 / 31.0

	//full months between ratification and April 1st
	const nFullMonthsBeforeRaise = getMonthDifference(jan1, apr1)

	// full months between April 1st to today
	const nFullMonthsSinceRaise = getMonthDifference(apr1, now)

	// partial fraction of current month
	const firstThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
	const daysSoFarThisMonth = (now - firstThisMonth) / 1000 / 86400
	const totalDaysInMonth = getDaysInThisMonth()
	const partialCurrMonth = daysSoFarThisMonth / totalDaysInMonth

	// get post-raise months multiplier
	const preRaiseMonths = partialDec2022 + nFullMonthsBeforeRaise
	const postRaiseMonths = nFullMonthsSinceRaise + partialCurrMonth

	// Get compensation info
	const old_perc = programCompInfo[progName]["old_percent"]
	const old_step = programCompInfo[progName]["old_step"]
	const apr_perc = programCompInfo[progName]["april1_percent"]
	const apr_step = programCompInfo[progName]["april1_step"]
	const got_raise = programCompInfo[progName]["got_april1_raise"]

	var compFull = null
	var compPartial = null

	// Compute 50% compensation
	if (got_raise) {
		const compFullBeforeRaise = oldCompSteps[old_step] * (preRaiseMonths/12.0)
		const compFullAfterRaise = april1CompSteps[apr_step] * (postRaiseMonths/12.0)
		compFull = compFullBeforeRaise + compFullAfterRaise
	} else {
		const compFullBeforeRaise = oldCompSteps[old_step] * (preRaiseMonths/12.0)
		const compFullAfterRaise = oldCompSteps[old_step] * (postRaiseMonths/12.0)
		compFull = compFullBeforeRaise + compFullAfterRaise
	}

	// Compute sub 50% compensation
	if (got_raise) {
		const compPartialBeforeRaise = (oldCompSteps[old_step] * 2) * (old_perc/100.0) * (preRaiseMonths/12.0)
		const compPartialAfterRaise = (april1CompSteps[apr_step] * 2) * (apr_perc/100.0) * (postRaiseMonths/12.0)
		compPartial = compPartialBeforeRaise + compPartialAfterRaise
	} else {
		const compPartialBeforeRaise = (oldCompSteps[old_step] * 2) * (old_perc/100.0) * (preRaiseMonths/12.0)
		const compPartialAfterRaise = (oldCompSteps[old_step] * 2) * (old_perc/100.0) * (postRaiseMonths/12.0)
		compPartial = compPartialBeforeRaise + compPartialAfterRaise
	}

	//return parseFloat((compFull - compPartial).toFixed(4))
	return compFull - compPartial
}

function computeAllMissingWages() {
	var totalMissing = 0

	for (var progName in nWorkers) {
		totalMissing += computeMissingWages(progName) * nWorkers[progName]
	}

	return totalMissing
}

let missingWages = document.getElementById("missingWages")
let missingAmount = null 
let progName = selectProgram.options[selectProgram.selectedIndex].value

// https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	minimumFractionDigits: 2,
	maximumFractionDigits: 4

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

let allMissingWages = document.getElementById("allMissingWages")
let allMissingAmount = computeAllMissingWages();
allMissingWages.innerHTML = "Approximate UCSD GSR missing wages total: " + formatter.format(parseFloat(allMissingAmount).toFixed(2))

selectProgram.addEventListener("change", (event) => {
	progName = event.target.value
});

// Update total amount no matter what
setInterval(function() {
	allMissingAmount = computeAllMissingWages();
	allMissingWages.innerHTML = "Approximate UCSD GSR missing wages total: " + formatter.format(parseFloat(allMissingAmount).toFixed(2))
}, 2000)

// Update individual amount
setInterval(function() {
	if (progName != "default") {
		missingAmount = computeMissingWages(progName);
		missingWages.innerHTML = "Your missing wages: " + formatter.format(parseFloat(missingAmount).toFixed(4))
	} else {
		missingWages.innerHTML = "Choose a program above to calculate individual missing wages"
	}
}, 2000)


