using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Calculator
{
    internal class UserInterface
    {
        public void GreedMessage()
        {
            Console.WriteLine("Welcome To Takamul Calculator");
        }
        public void Operations()
        {
            Console.WriteLine("Please Enter number of your chocie: ");
            Console.WriteLine("1. addition");
            Console.WriteLine("2. subtraction");
            Console.WriteLine("3. multiplication");
            Console.WriteLine("4. division");
            Console.WriteLine("5. even_odd");
            Console.WriteLine("6. factorial");
            Console.WriteLine("7. fibonacci");
            Console.WriteLine("8. exit");
        }
    }
}
