let carbonConstant;

function constantCalc(countryInput){
	carbonConstant = values[countryInput];
	carbonConstant*=1000000.0;
	carbonConstant=carbonConstant/365.0;
	carbonConstant=carbonConstant/24.0;
	carbonConstant=carbonConstant/60.0;
	carbonConstant=carbonConstant/60.0;
	carbonConstant=carbonConstant/1000.0;
	return carbonConstant;
}