///-------------------------------------------------------------------------------
///
/// This is your calculator implementation task
/// to practice enums, structs, and methods.
///
/// Complete the implementation of the Calculator struct and its methods.
///
/// The calculator should support basic arithmetic
/// operations (addition, subtraction, multiplication)
/// with overflow protection and maintain a history
/// of operations.
///
/// Tasks:
/// 1. Implement the OperationType enum methods
/// 2. Implement the Operation struct constructor
/// 3. Implement all Calculator methods
///
///-------------------------------------------------------------------------------

#[derive(Clone)]
pub enum OperationType {
    Addition,
    Subtraction,
    Multiplication,
}

impl OperationType {
    // TODO: Return the string representation of the operation sign
    // Addition -> "+", Subtraction -> "-", Multiplication -> "*"
    pub fn get_sign(&self) -> &str {
        // todo!()
        match self {
            OperationType::Addition => "+",
            OperationType::Subtraction => "-",
            OperationType::Multiplication => "*",
        }
    }

    // TODO: Perform the operation on two i64 numbers with overflow protection
    // Return Some(result) on success, None on overflow
    //
    // Example: OperationType::Multiplication.perform(x, y)
    pub fn perform(&self, x: i64, y: i64) -> Option<i64> {
        // todo!()
        match self {
            OperationType::Addition => x.checked_add(y),
            OperationType::Subtraction => x.checked_sub(y),
            OperationType::Multiplication => x.checked_mul(y),
        }
    }
}

#[derive(Clone)]
pub struct Operation {
    pub first_num: i64,
    pub second_num: i64,
    pub operation_type: OperationType,
}

impl Operation {
    // TODO: Create a new Operation with the given parameters
    pub fn new(first_num: i64, second_num: i64, operation_type: OperationType) -> Self {
        // todo!()
        let operation = Operation {
            first_num: first_num,
            second_num: second_num,
            operation_type: operation_type,
        };

        operation
    }
}

pub struct Calculator {
    pub history: Vec<Operation>,
}

impl Calculator {
    // TODO: Create a new Calculator with empty history
    pub fn new() -> Self {
        // todo!()
        let calculator = Calculator {
            history: Vec::new(),
        };

        calculator
    }

    // TODO: Perform addition and store successful operations in history
    // Return Some(result) on success, None on overflow
    pub fn addition(&mut self, x: i64, y: i64) -> Option<i64> {
        // todo!()
        let result = OperationType::perform(&OperationType::Addition, x, y);

        match result {
            Some(value) => println!("Addition result: {}", value),
            None => println!("Addition math overflow"),
        }

        let operation = Operation::new(x, y, OperationType::Addition);
        self.history.push(operation);

        result
    }

    // TODO: Perform subtraction and store successful operations in history
    // Return Some(result) on success, None on overflow
    pub fn subtraction(&mut self, x: i64, y: i64) -> Option<i64> {
        // todo!()
        let result = OperationType::perform(&OperationType::Subtraction, x, y);

        match result {
            Some(value) => println!("Subtraction result: {}", value),
            None => println!("Subtraction math overflow"),
        }

        let operation = Operation::new(x, y, OperationType::Subtraction);
        self.history.push(operation);

        result
    }

    // TODO: Perform multiplication and store successful operations in history
    // Return Some(result) on success, None on overflow
    pub fn multiplication(&mut self, x: i64, y: i64) -> Option<i64> {
        // todo!()
        let result = OperationType::perform(&OperationType::Multiplication, x, y);

        match result {
            Some(value) => println!("Multiplication result: {}", value),
            None => println!("Multiplication math overflow"),
        }

        let operation = Operation::new(x, y, OperationType::Multiplication);
        self.history.push(operation);

        result
    }

    // TODO: Generate a formatted string showing all operations in history
    // Format: "index: first_num operation_sign second_num = result\n"
    //
    // Example: "0: 5 + 3 = 8\n1: 10 - 2 = 8\n"
    pub fn show_history(&self) -> String {
        // todo!()
        let mut output = String::new();

        for (index, operation) in self.history.iter().enumerate() {
            let first_num = operation.first_num;
            let second_num = operation.second_num;
            let op_type = &operation.operation_type;
            let op_sign = OperationType::get_sign(&op_type);
            let perform_op = OperationType::perform(&op_type, first_num, second_num).unwrap();

            let format = &format!(
                "{}: {} {} {} = {:?}\n",
                index, first_num, op_sign, second_num, perform_op,
            );

            output.push_str(format);
        }

        output
    }

    // TODO: Repeat an operation from history by index
    // Add the repeated operation to history and return the result
    // Return None if the index is invalid
    pub fn repeat(&mut self, op_index: usize) -> Option<i64> {
        // todo!()
        let operation = self.history.get(op_index)?;
        let op_type = operation.operation_type.clone();

        let result = match operation.operation_type {
            OperationType::Addition => Some(operation.first_num + operation.second_num),
            OperationType::Subtraction => Some(operation.first_num - operation.second_num),
            OperationType::Multiplication => Some(operation.first_num * operation.second_num),
        }?;

        let new_op = match operation.operation_type {
            OperationType::Addition => {
                Operation::new(operation.first_num, operation.second_num, op_type)
            }
            OperationType::Subtraction => {
                Operation::new(operation.first_num, operation.second_num, op_type)
            }
            OperationType::Multiplication => {
                Operation::new(operation.first_num, operation.second_num, op_type)
            }
        };

        self.history.push(new_op);

        Some(result)
    }

    // TODO: Clear all operations from history
    pub fn clear_history(&mut self) {
        // todo!()
        self.history.clear();
    }
}
