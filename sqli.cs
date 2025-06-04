using System;
using System.Data.SqlClient;
using System.Diagnostics;

class VulnerableApp
{
    static void Main()
    {
        // Hardcoded credentials (vulnerability)
        string username = "admin";
        string password = "password123";

        Console.WriteLine("Enter your username:");
        string inputUser = Console.ReadLine();
        Console.WriteLine("Enter your password:");
        string inputPass = Console.ReadLine();

        // Insecure password comparison (plaintext)
        if (inputUser == username && inputPass == password)
        {
            Console.WriteLine("Login successful!");

            // SQL Injection vulnerability
            Console.WriteLine("Enter user ID to fetch:");
            string userId = Console.ReadLine();

            string connStr = "Server=localhost;Database=TestDB;Trusted_Connection=True;";
            string query = "SELECT * FROM Users WHERE Id = '" + userId + "'";

            using (SqlConnection conn = new SqlConnection(connStr))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(query, conn);
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Console.WriteLine(reader["Username"]);
                }
            }

            // Command Injection vulnerability
            Console.WriteLine("Enter filename to display:");
            string file = Console.ReadLine();
            Process.Start("cmd.exe", "/C type " + file);
        }
        else
        {
            Console.WriteLine("Invalid credentials.");
        }
    }
}
