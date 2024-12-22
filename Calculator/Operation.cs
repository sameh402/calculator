using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Calculator
{
    internal class Operation
    {
        public string addition(int num1, int num2)
        {
            return $"{num1} + {num2} = {num1 + num2}";
        }
        public string subtraction(int num1, int num2)
        {
            return $"{num1} - {num2} = {num1 - num2}";
        }
        public string multiply(int num1, int num2)
        {
            return $"{num1} x {num2} = {num1 * num2}";
        }
        public string division(int num1, int num2)
        {
            return $"{num1} / {num2} = {num1 / num2}";
        }
        public string even_odd(int num)
        {
            if (num % 2 == 0)
            {
                return $"{num} is even";
            }
            else
            {
                return $"{num} is even";

            }
        }
        public int factorial(int num)
        {
            if (num == 0 || num == 1)
            {
                return 1;
            }
            else
            {
                return num * factorial(num - 1);
            }
        }
        public int fibonacci(int num)
        {
            if (num == 0 || num == 1)
            {
                return num;
            }
            else
            {
                return fibonacci(num - 1) + fibonacci(num - 2);
            }
        }
    }
}
