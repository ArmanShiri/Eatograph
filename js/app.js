class CalorieTracker {
    constructor() {
        this._calorieLimit = 2000;
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];

        this._displayTotalCalories();
        this._displayCaloriesLimit();
        this._displayCaloriesBurned();
        this._displayCaloriesIntake();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }

    // Public methods
    addMeal(meal) {
        this._meals.push(meal);
        this._displayMeal(meal);
        this._totalCalories += meal.calories;
        this._updateUI();
    }

    addWorkout(workout) {
        this._workouts.push(workout);
        this._displayWorkout(workout);
        this._totalCalories -= workout.calories;
        -0;
        this._updateUI();
    }

    // Private Methods
    _displayTotalCalories() {
        const totalCaloriesEl = document.getElementById('calories-total');
        totalCaloriesEl.innerHTML = this._totalCalories;
    }

    _displayCaloriesLimit() {
        const caloriesLimitEl = document.getElementById('calories-limit');
        caloriesLimitEl.innerHTML = this._calorieLimit;
    }

    _displayCaloriesIntake() {
        const caloriesConsumedEl = document.getElementById('calories-consumed');

        const intake = this._meals.reduce(
            (total, meal) => total + meal.calories,
            0
        );

        caloriesConsumedEl.innerHTML = intake;
    }

    _displayCaloriesBurned() {
        const caloriesBurnedEl = document.getElementById('calories-burned');

        const burned = this._workouts.reduce(
            (total, workout) => total + workout.calories,
            0
        );

        caloriesBurnedEl.innerHTML = burned;
    }

    _displayCaloriesRemaining() {
        const caloriesRemainingEl =
            document.getElementById('calories-remaining');

        const remaining = this._calorieLimit - this._totalCalories;

        caloriesRemainingEl.innerHTML = remaining;

        if (remaining <= 0) {
            caloriesRemainingEl.parentElement.parentElement.classList.remove(
                'bg-light'
            );
            caloriesRemainingEl.parentElement.parentElement.classList.add(
                'bg-danger'
            );
        } else {
            caloriesRemainingEl.parentElement.parentElement.classList.remove(
                'bg-danger'
            );
            caloriesRemainingEl.parentElement.parentElement.classList.add(
                'bg-light'
            );
        }
    }

    _displayCaloriesProgress() {
        const progressEl = document.getElementById('calorie-progress');
        const percentage = (this._totalCalories / this._calorieLimit) * 100;
        const width = Math.min(percentage, 100);
        progressEl.style.width = `${width}%`;

        if (+document.getElementById('calories-remaining').innerHTML <= 0) {
            progressEl.classList.add('bg-danger');
        } else if (progressEl.classList.contains('bg-danger')) {
            progressEl.classList.remove('bg-danger');
        }
    }

    _displayMeal(meal) {
        const mealsEl = document.getElementById('meal-items');
        const mealEl = document.createElement('div');
        mealEl.classList.add('card', 'my-2');
        mealEl.setAttribute('data-id', meal.id);
        mealEl.innerHTML = `
        <div class="card-body">
            <div class="d-flex align-items-center justify-content-between">
                <h4 class="mx-1">${meal.name}</h4>
                <div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">
                    ${meal.calories}
                </div>
                <button class="delete btn btn-danger btn-sm mx-2">
                <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
        `;
        mealsEl.appendChild(mealEl);
    }

    _removeMeal(mealId) {
        let deletedMeal;
        for (let meal of this._meals) {
            if (meal.id === mealId) {
                deletedMeal = meal;
            }
        }

        this._meals = this._meals.filter(meal => meal.id !== mealId);

        this._totalCalories -= deletedMeal.calories;

        this._updateUI();
    }

    _displayWorkout(workout) {
        const workoutsEl = document.getElementById('workout-items');
        const workoutEl = document.createElement('div');
        workoutEl.classList.add('card', 'my-2');
        workoutEl.setAttribute('data-id', workout.id);
        workoutEl.innerHTML = `
        <div class="card-body">
            <div class="d-flex align-items-center justify-content-between">
                <h4 class="mx-1">${workout.name}</h4>
                <div class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5">
                    ${workout.calories}
                </div>
                <button class="delete btn btn-danger btn-sm mx-2">
                <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
        `;
        workoutsEl.appendChild(workoutEl);
    }

    _removeWorkout(workoutId) {
        let deletedWorkout;
        for (let workout of this._workouts) {
            if (workout.id === workoutId) {
                deletedWorkout = workout;
            }
        }

        this._workouts = this._workouts.filter(
            workout => workout.id !== workoutId
        );

        this._totalCalories += deletedWorkout.calories;

        this._updateUI();
    }

    _updateUI() {
        this._displayTotalCalories();
        this._displayCaloriesIntake();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }
}

class Meal {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class Workout {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class App {
    constructor() {
        this._tracker = new CalorieTracker();

        document
            .getElementById('meal-form')
            .addEventListener('submit', this._newItem.bind(this, 'meal'));

        document
            .getElementById('workout-form')
            .addEventListener('submit', this._newItem.bind(this, 'workout'));

        document
            .getElementById('meal-items')
            .addEventListener('click', this._removeItem.bind(this, 'meal'));

        document
            .getElementById('workout-items')
            .addEventListener('click', this._removeItem.bind(this, 'workout'));
    }

    _newItem(type, e) {
        e.preventDefault();

        const name = document.getElementById(`${type}-name`);
        const calories = document.getElementById(`${type}-calories`);

        // Validating Inputs
        if (name.value === '' || calories.value === '') {
            alert('Please fill in the form');
            return;
        }

        if (type === 'meal') {
            const meal = new Meal(name.value, +calories.value);
            this._tracker.addMeal(meal);
        } else {
            const workout = new Workout(name.value, +calories.value);
            this._tracker.addWorkout(workout);
        }

        name.value = '';
        calories.value = '';

        const collapseItem = document.getElementById(`collapse-${type}`);
        const bsCollpase = new bootstrap.Collapse(collapseItem, {
            toggle: true,
        });
    }

    _removeItem(type, e) {
        if (
            e.target.classList.contains('delete') ||
            e.target.classList.contains('fa-xmark')
        ) {
            if (confirm('Are You Sure?')) {
                const id = e.target.closest('.card').getAttribute('data-id');

                type === 'meal'
                    ? this._tracker._removeMeal(id)
                    : this._tracker._removeWorkout(id);

                e.target.closest('.card').remove();
            }
        }
    }
}

const app = new App();
